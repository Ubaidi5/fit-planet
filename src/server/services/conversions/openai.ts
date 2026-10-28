import "server-only";
import { env } from "@/server/env";
import { toMinorUnits } from "@/server/services/payments/types";
import { normalizeEmail, normalizePhone, sha256 } from "./hash";
import type { Conversion, ConversionSink } from "./types";

const eventTypes = {
  sign_up: "registration_completed",
  owner_lead: "lead_created",
  purchase: "order_created",
  reserve: "appointment_scheduled",
} as const;

/** OpenAI (ChatGPT ads) Conversions API: https://developers.openai.com/ads/conversions-api */
export const openaiSink: ConversionSink = {
  name: "openai",
  get enabled() {
    return Boolean(env.tracking.openai.pixelId && env.tracking.openai.apiKey);
  },

  async send(c: Conversion) {
    const { pixelId, apiKey } = env.tracking.openai;
    const phone = c.user.phone ? normalizePhone(c.user.phone) : null;
    const amount = c.value ? toMinorUnits(c.value.amount, c.value.currency) : undefined;
    const data =
      c.kind === "purchase" && c.value
        ? {
            type: "contents",
            amount,
            currency: c.value.currency,
            contents: [{ id: c.value.itemId, name: c.value.itemName, content_type: "product", quantity: 1, amount }],
          }
        : { type: "customer_action", ...(c.value ? { amount, currency: c.value.currency } : {}) };

    const event = {
      id: c.eventId,
      type: eventTypes[c.kind],
      timestamp_ms: c.at.getTime(),
      action_source: "web",
      source_url: c.attribution.sourceUrl,
      oppref: c.attribution.oppref,
      user: {
        obref: c.attribution.obref,
        emails_sha256: c.user.email ? [sha256(normalizeEmail(c.user.email))] : undefined,
        phone_numbers_sha256: phone ? [sha256(phone)] : undefined,
        external_ids_sha256: [sha256(c.user.id)],
        ip_address: c.attribution.ip,
        user_agent: c.attribution.userAgent,
      },
      data,
    };

    const response = await fetch(`https://bzr.openai.com/v1/events?pid=${encodeURIComponent(pixelId!)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ integration_source: "fit_planet", events: [event] }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`OpenAI CAPI ${response.status}: ${(await response.text()).slice(0, 300)}`);
  },
};
