import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HiOutlineBeaker } from "react-icons/hi2";
import { collections, toObjectId } from "@/server/db/collections";
import { confirmOnlinePayment, formatMoney } from "@/server/modules/bookings";
import { getSessionUser } from "@/server/session";
import { env } from "@/server/env";
import { passMeta } from "@/lib/passes";
import { SubmitButton } from "@/components/auth/FormBits";

export const metadata: Metadata = { title: "Test payment", robots: { index: false } };
export const dynamic = "force-dynamic";

type Search = { session?: string; ref?: string; success?: string; cancel?: string };

/** Fake gateway page for PAYMENT_PROVIDER=mock. Lets you test the full flow without Stripe keys. */
export default async function MockCheckout({ searchParams }: { searchParams: Promise<Search> }) {
  if (env.payments.provider !== "mock") notFound();
  const { session, ref, cancel } = await searchParams;
  const id = toObjectId(ref);
  const user = await getSessionUser();
  if (!id || !user) notFound();
  const booking = await (await collections.bookings()).findOne({ _id: id, userId: user._id });
  if (!booking) notFound();
  const gym = await (await collections.gyms()).findOne({ _id: booking.gymId }, { projection: { name: 1 } });

  async function pay() {
    "use server";
    const current = await getSessionUser();
    if (!current || !id) return;
    await confirmOnlinePayment(id, session);
    redirect(`/app/passes/${id.toHexString()}?new=1`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-surface p-6 shadow-lift ring-1 ring-gray-900/[0.06]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-stamp-ochre/10 px-3 py-1 text-xs font-semibold text-stamp-ochre">
          <HiOutlineBeaker className="size-3.5" />
          Test payment
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">{formatMoney(booking.amount, booking.currency)}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {passMeta[booking.passType].label} at {gym?.name}. This is the mock gateway: no card is charged. Set Stripe keys to take real payments.
        </p>
        <form action={pay} className="mt-6 space-y-2">
          <SubmitButton variant="secondary" pendingLabel="Paying...">
            Pay {formatMoney(booking.amount, booking.currency)}
          </SubmitButton>
          <a href={cancel ?? "/"} className="flex h-12 items-center justify-center rounded-full text-sm font-medium text-gray-600 hover:bg-gray-900/5">
            Cancel
          </a>
        </form>
      </div>
    </main>
  );
}
