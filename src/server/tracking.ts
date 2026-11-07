import "server-only";
import { cookies, headers } from "next/headers";
import { env } from "@/server/env";
import { clientIp } from "@/server/rate-limit";
import { CONSENT_COOKIE, parseConsent, type Consent, type TrackingConfig } from "@/lib/analytics/consent";
import { EVENTS_COOKIE, eventIds, type AnalyticsEvent } from "@/lib/analytics/events";
import { sendConversion, type Attribution } from "@/server/services/conversions";

/** Public ids the browser needs; secrets stay on the server */
export function trackingConfig(): TrackingConfig {
  const t = env.tracking;
  return { gtmId: t.gtmId, ga4Id: t.ga4Id, metaPixelId: t.meta.pixelId, openaiPixelId: t.openai.pixelId };
}

export async function readConsent(): Promise<Consent | null> {
  try {
    return parseConsent((await cookies()).get(CONSENT_COOKIE)?.value);
  } catch {
    return null;
  }
}

/**
 * The request's details for server-side conversions. Null unless the visitor
 * accepted ad cookies, so nothing is sent for people who declined.
 */
export async function requestAttribution(): Promise<Attribution | null> {
  try {
    const consent = await readConsent();
    if (!consent?.ads) return null;
    const [jar, head] = await Promise.all([cookies(), headers()]);
    const ip = await clientIp();
    const referer = head.get("referer");
    return {
      ip: ip === "unknown" ? undefined : ip,
      userAgent: head.get("user-agent") ?? undefined,
      sourceUrl: referer?.startsWith(env.appUrl) ? referer : env.appUrl,
      fbp: jar.get("_fbp")?.value,
      fbc: jar.get("_fbc")?.value,
      obref: jar.get("__obref")?.value,
      oppref: jar.get("__oppref")?.value,
    };
  } catch {
    // Outside a request (cron, scripts)
    return null;
  }
}

/**
 * Leaves an event for the browser to send after the redirect that follows a
 * server action. Only for visitors who accepted analytics or ads.
 */
export async function queueBrowserEvent(event: AnalyticsEvent) {
  try {
    const consent = await readConsent();
    if (!consent || (!consent.analytics && !consent.ads)) return;
    const jar = await cookies();
    let queued: AnalyticsEvent[] = [];
    try {
      queued = JSON.parse(jar.get(EVENTS_COOKIE)?.value ?? "[]");
    } catch {}
    if (!Array.isArray(queued)) queued = [];
    // A fresh sign-up also signs in; that's not a separate login
    if (event.name === "login" && queued.some((e) => e.name === "sign_up")) return;
    // Next URL-encodes cookie values on write and decodes them on read
    jar.set(EVENTS_COOKIE, JSON.stringify([...queued, event].slice(-5)), {
      path: "/",
      maxAge: 300,
      sameSite: "lax",
      secure: env.isProd,
      httpOnly: false,
    });
  } catch {
    // Not in a server action or route handler; nothing to do
  }
}

/** Sign-up or sign-in: browser event for analytics, plus a server conversion for a new account */
export async function trackAuth(input: { method: string; isNewUser: boolean; owner?: boolean; user: { id: string; email?: string | null } }) {
  if (!input.isNewUser) return queueBrowserEvent({ name: "login", method: input.method });
  const id = eventIds.signUp(input.user.id);
  await queueBrowserEvent({ name: "sign_up", method: input.method, owner: input.owner, id });
  const attribution = await requestAttribution();
  if (attribution) {
    void sendConversion({
      kind: input.owner ? "owner_lead" : "sign_up",
      eventId: id,
      at: new Date(),
      attribution,
      user: { id: input.user.id, email: input.user.email },
    });
  }
}
