import "server-only";
import { env } from "@/server/env";
import { normalizeEmail, normalizePhone, sha256 } from "./hash";
import type { Conversion, ConversionSink } from "./types";

const eventNames = {
  sign_up: "CompleteRegistration",
  owner_lead: "Lead",
  purchase: "Purchase",
  reserve: "Schedule",
} as const;

/** Meta Conversions API: https://developers.facebook.com/docs/marketing-api/conversions-api */
export const metaSink: ConversionSink = {
  name: "meta",
  get enabled() {
    return Boolean(env.tracking.meta.pixelId && env.tracking.meta.accessToken);
  },

  async send(c: Conversion) {
    const { pixelId, accessToken, testEventCode, graphVersion } = env.tracking.meta;
    const phone = c.user.phone ? normalizePhone(c.user.phone) : null;
    const event = {
      event_name: eventNames[c.kind],
      event_time: Math.floor(c.at.getTime() / 1000),
      event_id: c.eventId,
      action_source: "website",
      event_source_url: c.attribution.sourceUrl,
      user_data: {
        em: c.user.email ? [sha256(normalizeEmail(c.user.email))] : undefined,
        ph: phone ? [sha256(phone)] : undefined,
        external_id: [sha256(c.user.id)],
        client_ip_address: c.attribution.ip,
        client_user_agent: c.attribution.userAgent,
        fbp: c.attribution.fbp,
        fbc: c.attribution.fbc,
      },
      custom_data: c.value
        ? {
            value: c.value.amount,
            currency: c.value.currency,
            content_ids: [c.value.itemId],
            content_name: c.value.itemName,
            content_type: "product",
            num_items: 1,
          }
        : undefined,
    };

    const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event], access_token: accessToken, ...(testEventCode ? { test_event_code: testEventCode } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Meta CAPI ${response.status}: ${(await response.text()).slice(0, 300)}`);
  },
};
