/**
 * Server-side conversions: the same funnel events the browser pixels send,
 * posted straight to the ad platforms so ad blockers and closed tabs don't
 * lose them. Both sides share an event id, so each platform counts once.
 */

/** What the browser request looked like, captured only for visitors who accepted ad cookies */
export interface Attribution {
  ip?: string;
  userAgent?: string;
  /** Page the conversion happened on */
  sourceUrl: string;
  /** Meta's browser id and click id cookies */
  fbp?: string;
  fbc?: string;
  /** OpenAI pixel's browser reference and ad click reference cookies */
  obref?: string;
  oppref?: string;
}

export type ConversionKind = "sign_up" | "owner_lead" | "purchase" | "reserve";

export interface Conversion {
  kind: ConversionKind;
  /** Shared with the browser pixel's event id */
  eventId: string;
  at: Date;
  attribution: Attribution;
  user: { id: string; email?: string | null; phone?: string | null };
  /** Bookings only */
  value?: { amount: number; currency: string; itemId: string; itemName: string };
}

export interface ConversionSink {
  readonly name: string;
  readonly enabled: boolean;
  send(conversion: Conversion): Promise<void>;
}
