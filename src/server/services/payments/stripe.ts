import "server-only";
import Stripe from "stripe";
import { env } from "@/server/env";
import { fromMinorUnits, toMinorUnits, type PaymentEvent, type PaymentProvider } from "./types";

let client: Stripe | null = null;

function stripe() {
  if (!env.payments.stripeSecretKey) throw new Error("STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(env.payments.stripeSecretKey);
  return client;
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",

  async createCheckout(input) {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      // Stripe's shortest allowed window; the booking is held for longer (see reminders.ts), so a paid session always finds it
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      client_reference_id: input.reference,
      customer_email: input.customerEmail ?? undefined,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: { reference: input.reference, ...input.metadata },
      payment_intent_data: { metadata: { reference: input.reference, ...input.metadata } },
      line_items: input.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: toMinorUnits(item.amount, input.currency),
          product_data: {
            name: item.name,
            description: item.description,
            images: item.imageUrl?.startsWith("https://") ? [item.imageUrl] : undefined,
          },
        },
      })),
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { id: session.id, url: session.url };
  },

  async getCheckoutStatus(sessionId) {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    return { paid: session.payment_status === "paid", reference: session.client_reference_id ?? undefined };
  },

  async parseWebhook(rawBody, headers): Promise<PaymentEvent> {
    const signature = headers.get("stripe-signature");
    if (!signature || !env.payments.stripeWebhookSecret) throw new Error("Missing Stripe signature or webhook secret");
    const event = stripe().webhooks.constructEvent(rawBody, signature, env.payments.stripeWebhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.payment_status !== "paid" || !session.client_reference_id) return { type: "ignored" };
        return {
          type: "payment.succeeded",
          reference: session.client_reference_id,
          providerRef: session.id,
          amount: session.amount_total != null && session.currency ? fromMinorUnits(session.amount_total, session.currency) : undefined,
          currency: session.currency?.toUpperCase(),
        };
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;
        if (!session.client_reference_id) return { type: "ignored" };
        return { type: "payment.failed", reference: session.client_reference_id, providerRef: session.id };
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const intent = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        return { type: "payment.refunded", reference: charge.metadata?.reference, providerRef: intent ?? charge.id };
      }
      default:
        return { type: "ignored" };
    }
  },

  async refund(providerRef, amount) {
    // providerRef is the checkout session id; refund its payment intent
    const session = await stripe().checkout.sessions.retrieve(providerRef);
    const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (!intent) throw new Error("No payment to refund");
    await stripe().refunds.create({
      payment_intent: intent,
      amount: amount != null && session.currency ? toMinorUnits(amount, session.currency) : undefined,
    });
  },
};
