import "server-only";
import type { PaymentProvider } from "./types";
import { env } from "@/server/env";

/**
 * Test provider for local development and demos without gateway keys.
 * Checkout sends the member to our own fake payment page, which confirms
 * the booking straight away. Never enable in production with real money.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createCheckout(input) {
    const id = `mock_${input.reference}_${Date.now().toString(36)}`;
    const params = new URLSearchParams({ session: id, ref: input.reference, success: input.successUrl, cancel: input.cancelUrl });
    return { id, url: `${env.appUrl}/checkout/mock?${params.toString()}` };
  },

  async getCheckoutStatus(sessionId) {
    // The mock page marks bookings paid directly, so status is read from the booking itself
    const reference = sessionId.split("_")[1];
    return { paid: false, reference };
  },

  async parseWebhook() {
    return { type: "ignored" };
  },

  async refund() {
    // Nothing to refund at a fake gateway
  },
};
