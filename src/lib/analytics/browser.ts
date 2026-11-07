/**
 * Browser side of tracking: loads the tags people consented to and sends
 * funnel events to each of them. Events that arrive before the tags load
 * wait in a queue; if the visitor declines, the queue is dropped.
 *
 * Google: GA4 is loaded directly when GA4_MEASUREMENT_ID is set, and every
 * event is also pushed to the dataLayer for Tag Manager (Google Ads, other
 * networks). Configure a GA4 tag in GTM only if GA4_MEASUREMENT_ID is empty,
 * or GA4 counts everything twice.
 */

import { toMinorUnits } from "@/server/services/payments/types";
import { CONSENT_COOKIE, CONSENT_MAX_AGE, serializeConsent, type Consent, type TrackingConfig } from "./consent";
import { EVENTS_COOKIE, type AnalyticsEvent, type TrackedPass } from "./events";

type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    oaiq?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

interface Active {
  gtm: boolean;
  ga4: boolean;
  meta: boolean;
  openai: boolean;
}

const active: Active = { gtm: false, ga4: false, meta: false, openai: false };
let config: TrackingConfig = {};
/** Waiting for the consent decision; null once it's made */
let pending: AnalyticsEvent[] | null = [];

function injectScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function googleConsent(consent: Consent) {
  const ads = consent.ads ? "granted" : "denied";
  return {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

function loadGoogle(next: Consent, userId: string | undefined) {
  const wantGtm = Boolean(config.gtmId) && (next.analytics || next.ads);
  const wantGa4 = Boolean(config.ga4Id) && next.analytics;
  if (!wantGtm && !wantGa4) return;

  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js only reads real `arguments` objects
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", { ...googleConsent(next), wait_for_update: 500 });
    window.gtag("set", "ads_data_redaction", !next.ads);
    if (userId) window.dataLayer.push({ user_id: userId });
  } else {
    window.gtag("consent", "update", googleConsent(next));
  }

  if (wantGtm && !active.gtm) {
    window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId!)}`);
    active.gtm = true;
  }
  if (wantGa4 && !active.ga4) {
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4Id!)}`);
    window.gtag("js", new Date());
    // Page views come from GA4's enhanced measurement, which follows client-side navigation
    window.gtag("config", config.ga4Id, userId ? { user_id: userId } : {});
    active.ga4 = true;
  }
}

function loadMeta() {
  if (!config.metaPixelId || active.meta) return;
  if (!window.fbq) {
    // Meta's base code, unminified
    const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq ??= fbq;
    injectScript("https://connect.facebook.net/en_US/fbevents.js");
  }
  window.fbq("consent", "grant");
  window.fbq("init", config.metaPixelId);
  active.meta = true;
}

function loadOpenAI() {
  if (!config.openaiPixelId || active.openai) return;
  if (!window.oaiq) {
    const oaiq: NonNullable<Window["oaiq"]> = function (...args: unknown[]) {
      (oaiq.q = oaiq.q ?? []).push(args);
    };
    window.oaiq = oaiq;
    injectScript("https://bzrcdn.openai.com/sdk/oaiq.min.js");
  }
  window.oaiq("consent", true);
  window.oaiq("init", { pixelId: config.openaiPixelId });
  active.openai = true;
}

/**
 * Applies a consent decision: loads newly allowed tags and flushes waiting
 * events. Returns true when something previously allowed was withdrawn; the
 * caller reloads the page then, since loaded scripts can't be unloaded.
 */
export function applyConsent(next: Consent, cfg: TrackingConfig, userId?: string): boolean {
  config = cfg;
  const withdrawn = (active.ga4 && !next.analytics) || ((active.meta || active.openai) && !next.ads) || (active.gtm && !next.analytics && !next.ads);
  if (withdrawn) {
    window.gtag?.("consent", "update", googleConsent(next));
    if (!next.ads) {
      window.fbq?.("consent", "revoke");
      // Removes the pixel's own cookies
      window.oaiq?.("consent", false);
    }
    clearTrackingCookies(next);
    return true;
  }

  loadGoogle(next, userId);
  if (next.ads) {
    loadMeta();
    loadOpenAI();
  }

  const queued = pending;
  pending = null;
  queued?.forEach(send);
  return false;
}

/** Saves the visitor's choice for six months */
export function saveConsent(consent: Consent) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(consent)}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax${secure}`;
}

function clearTrackingCookies(next: Consent) {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim());
  const drop = names.filter((name) => (!next.analytics && name.startsWith("_ga")) || (!next.ads && ["_fbp", "_fbc", "_gcl_au", "__oppref", "__obref"].includes(name)));
  // Analytics cookies are set on the registrable domain, so clear both forms
  const host = location.hostname;
  const domains = ["", `; domain=${host}`, `; domain=.${host.split(".").slice(-2).join(".")}`];
  for (const name of drop) for (const domain of domains) document.cookie = `${name}=; path=/; max-age=0${domain}`;
}

export function setUserId(userId: string | undefined) {
  if (active.ga4 && config.ga4Id) window.gtag?.("config", config.ga4Id, { user_id: userId ?? null, send_page_view: false });
  if (active.gtm) window.dataLayer?.push({ event: "user_data", user_id: userId ?? null });
}

/** A page view on every client-side navigation (GA4 tracks these itself) */
export function trackPageView() {
  if (pending) return;
  const path = location.pathname + location.search;
  if (active.gtm) window.dataLayer?.push({ event: "page_view", page_location: location.href, page_path: path, page_title: document.title });
  if (active.meta) window.fbq?.("track", "PageView");
  if (active.openai) window.oaiq?.("measure", "page_viewed", { type: "contents", contents: [{ id: location.pathname, name: document.title, content_type: "page" }] });
}

export function track(event: AnalyticsEvent) {
  if (pending) {
    // Keep a handful until the visitor decides; a page that fires dozens has a bug
    if (pending.length < 20) pending.push(event);
    return;
  }
  send(event);
}

/** Sends the events the server left in a cookie before a redirect (sign-up, login) */
export function flushServerEvents() {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${EVENTS_COOKIE}=`))
    ?.slice(EVENTS_COOKIE.length + 1);
  if (!raw) return;
  document.cookie = `${EVENTS_COOKIE}=; path=/; max-age=0`;
  try {
    const events = JSON.parse(decodeURIComponent(raw)) as AnalyticsEvent[];
    if (Array.isArray(events)) events.slice(0, 5).forEach(track);
  } catch {
    // A broken cookie is just dropped
  }
}

function google(name: string, params: Params, ecommerce = false) {
  if (active.ga4) window.gtag?.("event", name, { ...params, send_to: config.ga4Id });
  if (active.gtm) {
    if (ecommerce) {
      // GTM's recommended pattern: clear the previous ecommerce object first
      window.dataLayer?.push({ ecommerce: null });
      window.dataLayer?.push({ event: name, ecommerce: params });
    } else {
      window.dataLayer?.push({ event: name, ...params });
    }
  }
}

function meta(name: string, params: Params, eventId?: string) {
  if (active.meta) window.fbq?.("track", name, params, eventId ? { eventID: eventId } : undefined);
}

function openai(name: string, data: Params, eventId?: string) {
  if (active.openai) window.oaiq?.("measure", name, data, eventId ? { event_id: eventId } : undefined);
}

function gaItem(pass: TrackedPass) {
  return { item_id: `${pass.gymId}:${pass.passType}`, item_name: pass.gymName, item_category: pass.city, item_variant: pass.passType, price: pass.amount, quantity: 1 };
}

function openaiContents(pass: TrackedPass) {
  const amount = toMinorUnits(pass.amount, pass.currency);
  return {
    type: "contents",
    amount,
    currency: pass.currency,
    contents: [{ id: `${pass.gymId}:${pass.passType}`, name: pass.gymName, content_type: "product", quantity: 1, amount, currency: pass.currency }],
  };
}

function send(event: AnalyticsEvent) {
  switch (event.name) {
    case "sign_up":
      google("sign_up", { method: event.method, account_type: event.owner ? "owner" : "member" });
      if (event.owner) {
        google("generate_lead", { lead_type: "gym_owner" });
        meta("Lead", { content_category: "gym_owner" }, event.id);
        openai("lead_created", { type: "customer_action" }, event.id);
      } else {
        meta("CompleteRegistration", { status: true, content_name: event.method }, event.id);
        openai("registration_completed", { type: "customer_action" }, event.id);
      }
      break;
    case "login":
      google("login", { method: event.method });
      break;
    case "view_gym": {
      const { gym } = event;
      const value = gym.price && gym.currency ? { value: gym.price, currency: gym.currency } : {};
      google("view_item", { ...value, items: [{ item_id: gym.id, item_name: gym.name, item_category: gym.city }] }, true);
      meta("ViewContent", { ...value, content_ids: [gym.id], content_name: gym.name, content_category: gym.city, content_type: "product" });
      openai("contents_viewed", { type: "contents", contents: [{ id: gym.id, name: gym.name, content_type: "product" }] });
      break;
    }
    case "search":
      google("search", { search_term: event.term });
      meta("Search", { search_string: event.term });
      break;
    case "save_gym":
      google("add_to_wishlist", { items: [{ item_id: event.gymId }] }, true);
      meta("AddToWishlist", { content_ids: [event.gymId], content_type: "product" });
      break;
    case "begin_checkout": {
      const { pass } = event;
      google("begin_checkout", { value: pass.amount, currency: pass.currency, payment_type: event.paymentMethod, items: [gaItem(pass)] }, true);
      meta("InitiateCheckout", { value: pass.amount, currency: pass.currency, content_ids: [`${pass.gymId}:${pass.passType}`], content_type: "product", num_items: 1 });
      openai("checkout_started", openaiContents(pass));
      break;
    }
    case "purchase": {
      const { pass } = event;
      google("purchase", { transaction_id: event.transactionId, value: pass.amount, currency: pass.currency, items: [gaItem(pass)] }, true);
      meta("Purchase", { value: pass.amount, currency: pass.currency, content_ids: [`${pass.gymId}:${pass.passType}`], content_type: "product", num_items: 1 }, event.id);
      openai("order_created", openaiContents(pass), event.id);
      break;
    }
    case "reserve": {
      // Not revenue yet (paid at the desk), so it's not a GA4 purchase
      const { pass } = event;
      google("reserve_pass", { transaction_id: event.transactionId, value: pass.amount, currency: pass.currency, payment_type: "desk", items: [gaItem(pass)] });
      meta("Schedule", { value: pass.amount, currency: pass.currency, content_ids: [`${pass.gymId}:${pass.passType}`] }, event.id);
      openai("appointment_scheduled", { type: "customer_action", amount: toMinorUnits(pass.amount, pass.currency), currency: pass.currency }, event.id);
      break;
    }
    case "publish_gym":
      google("publish_gym", { gym_id: event.gymId });
      break;
  }
}
