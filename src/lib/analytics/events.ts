/**
 * Funnel events, in one provider-neutral shape. The browser tracker and the
 * server-side conversion APIs both map these onto GA4, Meta and OpenAI names,
 * so a new step in the journey is added here once.
 */

import type { PassType } from "@/lib/types";

export interface TrackedGym {
  id: string;
  name: string;
  city: string;
  /** Cheapest pass price, shown as the item's value */
  price?: number;
  currency?: string;
}

export interface TrackedPass {
  gymId: string;
  gymName: string;
  city: string;
  passType: PassType;
  amount: number;
  currency: string;
}

export type AnalyticsEvent =
  | { name: "sign_up"; method: string; owner?: boolean; id?: string }
  | { name: "login"; method: string }
  | { name: "view_gym"; gym: TrackedGym }
  | { name: "search"; term: string }
  | { name: "save_gym"; gymId: string }
  | { name: "begin_checkout"; pass: TrackedPass; paymentMethod: "online" | "desk" }
  /** Paid online */
  | { name: "purchase"; pass: TrackedPass; id: string; transactionId: string }
  /** Reserved now, paid at the front desk */
  | { name: "reserve"; pass: TrackedPass; id: string; transactionId: string }
  | { name: "publish_gym"; gymId: string };

/** Event ids shared by the browser pixel and the server API, so platforms count each conversion once */
export const eventIds = {
  signUp: (userId: string) => `signup-${userId}`,
  booking: (bookingId: string, method: "online" | "desk") => `${method === "desk" ? "reserve" : "purchase"}-${bookingId}`,
};

/** Events the server sets for the browser to send after a redirect (sign-up, login) */
export const EVENTS_COOKIE = "fp_events";
