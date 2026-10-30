import { NextResponse } from "next/server";
import { paymentProvider } from "@/server/services/payments";
import { toObjectId } from "@/server/db/collections";
import { collections } from "@/server/db/collections";
import { confirmOnlinePayment, markPaymentFailed, refundOrphanedPayment } from "@/server/modules/bookings";
import { reportError } from "@/lib/monitoring";

/**
 * Payment webhooks: /api/webhooks/payments/stripe (and future providers).
 * The provider verifies the signature and turns the payload into a
 * provider-neutral PaymentEvent, so this handler never changes per gateway.
 */
export async function POST(request: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider: name } = await ctx.params;
  const provider = paymentProvider(name);
  if (!provider) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  const raw = await request.text();
  let event;
  try {
    event = await provider.parseWebhook(raw, request.headers);
  } catch (error) {
    console.error(`[webhook:${name}] rejected`, error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "payment.succeeded") {
      const id = toObjectId(event.reference);
      if (id && !(await confirmOnlinePayment(id, event.providerRef))) await refundOrphanedPayment(provider, id, event.providerRef);
    } else if (event.type === "payment.failed") {
      const id = toObjectId(event.reference);
      if (id) await markPaymentFailed(id);
    } else if (event.type === "payment.refunded") {
      const bookings = await collections.bookings();
      const id = toObjectId(event.reference);
      await bookings.updateOne(id ? { _id: id } : { paymentRef: event.providerRef }, {
        $set: { status: "refunded", paymentStatus: "refunded", cancelledAt: new Date() },
      });
    }
  } catch (error) {
    reportError(`[webhook:${name}] handler failed`, error);
    // 500 makes the provider retry later
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
