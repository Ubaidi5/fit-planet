import "server-only";
import { env } from "@/server/env";
import type { PaymentProvider } from "./types";
import { stripeProvider } from "./stripe";
import { mockProvider } from "./mock";

export * from "./types";

const providers: Record<string, PaymentProvider> = {
  stripe: stripeProvider,
  mock: mockProvider,
};

/** The active payment provider, chosen by PAYMENT_PROVIDER */
export function payments(): PaymentProvider {
  return providers[env.payments.provider] ?? mockProvider;
}

/** Look a provider up by name, e.g. to handle a webhook or refund an older booking */
export function paymentProvider(name: string): PaymentProvider | undefined {
  return providers[name];
}
