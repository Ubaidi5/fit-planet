import { redirect } from "next/navigation";
import { collections, toObjectId } from "@/server/db/collections";
import { confirmOnlinePayment } from "@/server/modules/bookings";
import { paymentProvider } from "@/server/services/payments";
import { getSessionUser } from "@/server/session";

export const dynamic = "force-dynamic";

/**
 * Where the payment page sends members back. We confirm with the provider
 * directly (webhooks can arrive a few seconds later), then show the pass.
 */
export default async function CheckoutSuccess({ searchParams }: { searchParams: Promise<{ booking?: string; session?: string }> }) {
  const { booking, session } = await searchParams;
  const id = toObjectId(booking);
  const user = await getSessionUser();
  if (!id || !user) redirect("/app/passes");

  const doc = await (await collections.bookings()).findOne({ _id: id, userId: user._id });
  if (!doc) redirect("/app/passes");

  if (doc.status === "pending" && doc.paymentProvider && session) {
    try {
      const status = await paymentProvider(doc.paymentProvider)?.getCheckoutStatus(session);
      if (status?.paid && status.reference === id.toHexString()) await confirmOnlinePayment(id, session);
    } catch (error) {
      console.error("[checkout] status check failed", error);
    }
  }
  redirect(`/app/passes/${id.toHexString()}?new=1`);
}
