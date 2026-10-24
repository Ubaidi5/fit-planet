/**
 * Payment provider contract. Any gateway (Stripe, Safepay, PayFast, Paddle...)
 * plugs in by implementing this interface and registering in `index.ts`.
 * Amounts are in the currency's major unit (e.g. 12.50 USD, 1500 PKR).
 */

export interface CheckoutLineItem {
  name: string;
  description?: string;
  amount: number;
  quantity: number;
  imageUrl?: string;
}

export interface CreateCheckoutInput {
  /** Our booking id, echoed back in webhooks */
  reference: string;
  currency: string;
  items: CheckoutLineItem[];
  customerEmail?: string | null;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  /** Provider's id for the session, stored on the booking as paymentRef */
  id: string;
  /** Where to send the member to pay */
  url: string;
}

export type PaymentEvent =
  | { type: "payment.succeeded"; reference: string; providerRef: string; amount?: number; currency?: string }
  | { type: "payment.failed"; reference: string; providerRef: string }
  | { type: "payment.refunded"; reference?: string; providerRef: string }
  | { type: "ignored" };

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>;
  /** Looks a session up directly, used on the success page so we don't depend on webhook timing */
  getCheckoutStatus(sessionId: string): Promise<{ paid: boolean; reference?: string }>;
  /** Verifies and parses a webhook request from the provider */
  parseWebhook(rawBody: string, headers: Headers): Promise<PaymentEvent>;
  refund(providerRef: string, amount?: number): Promise<void>;
}

/** Currencies that have no minor unit (Stripe "zero-decimal" list) */
const ZERO_DECIMAL = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

export function toMinorUnits(amount: number, currency: string) {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? Math.round(amount) : Math.round(amount * 100);
}

export function fromMinorUnits(amount: number, currency: string) {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? amount : amount / 100;
}
