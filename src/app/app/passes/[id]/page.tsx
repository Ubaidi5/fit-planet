import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HiArrowLeft, HiCheckCircle, HiOutlineArrowTopRightOnSquare, HiOutlineMapPin } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { formatMoney, getUserBooking } from "@/server/modules/bookings";
import { collections, toObjectId } from "@/server/db/collections";
import { PassQR } from "@/components/pass/PassQR";
import { CancelBookingButton } from "@/components/pass/CancelBookingButton";
import { MrzLine } from "@/components/passport/MrzLine";
import { cityCode } from "@/lib/data/cities";
import { formatDate, todayIn } from "@/lib/dates";
import { getRegion } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { eventIds } from "@/lib/analytics/events";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("pass"))("meta") };
}

const statusTone = {
  confirmed: "bg-volt text-ink",
  pending: "bg-stamp-ochre/15 text-stamp-ochre",
  cancelled: "bg-gray-900/[0.06] text-gray-600",
  refunded: "bg-gray-900/[0.06] text-gray-600",
  expired: "bg-gray-900/[0.06] text-gray-600",
} as const;

export default async function PassPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/app/passes/${id}`);
  const bookingId = toObjectId(id);
  const booking = bookingId ? await getUserBooking(user._id, bookingId) : null;
  if (!booking) notFound();

  const gymDoc = await (await collections.gyms()).findOne({ _id: toObjectId(booking.gym.id)! }, { projection: { location: 1, policies: 1 } });
  const [t, tp, { locale }] = await Promise.all([getTranslations("pass"), getTranslations("passes"), getRegion()]);
  const status = booking.isUpcoming
    ? { label: t("status.upcoming"), tone: "bg-emerald-50 text-emerald-700" }
    : { label: t(`status.${booking.status}`), tone: statusTone[booking.status] };
  const usable = booking.status === "confirmed";
  const today = todayIn(booking.gym.timezone);
  const canCancel = (booking.status === "confirmed" && booking.startDate > today && booking.checkinCount === 0) || booking.status === "pending";
  const dates =
    booking.startDate === booking.endDate
      ? formatDate(booking.startDate, locale, { weekday: "long", day: "numeric", month: "long" })
      : t("range", {
          from: formatDate(booking.startDate, locale, { day: "numeric", month: "short" }),
          to: formatDate(booking.endDate, locale, { day: "numeric", month: "short", year: "numeric" }),
        });
  const directions = gymDoc ? `https://www.google.com/maps/dir/?api=1&destination=${gymDoc.location.coordinates[1]},${gymDoc.location.coordinates[0]}` : null;

  return (
    <div className="mx-auto max-w-md lg:max-w-4xl">
      <Link href="/app/passes" className="mb-4 inline-flex h-10 items-center gap-2 rounded-full ps-1 pe-3 text-sm font-medium text-gray-600 hover:text-ink">
        <HiArrowLeft className="size-4 rtl:rotate-180" />
        {t("all")}
      </Link>

      {isNew && usable && (booking.paymentMethod === "desk" || booking.paymentStatus === "paid") && (
        <TrackEvent
          once={eventIds.booking(booking.id, booking.paymentMethod)}
          event={{
            name: booking.paymentMethod === "desk" ? "reserve" : "purchase",
            id: eventIds.booking(booking.id, booking.paymentMethod),
            transactionId: booking.id,
            pass: { gymId: booking.gym.id, gymName: booking.gym.name, city: booking.gym.city, passType: booking.passType, amount: booking.amount, currency: booking.currency },
          }}
        />
      )}

      {isNew && usable && (
        <div className="mb-5 flex items-start gap-3 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-600/15 animate-fade-up">
          <HiCheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">{t("booked")}</p>
            <p className="text-sm text-emerald-800/80">
              {booking.paymentMethod === "desk"
                ? t("payAtDesk", { amount: formatMoney(booking.amount, booking.currency) })
                : t("paymentReceived")}
            </p>
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-8">
        {/* The pass */}
        <article className="overflow-hidden rounded-[2rem] bg-surface shadow-pass ring-1 ring-gray-900/[0.06]">
          <div className="bg-ink px-6 pt-6 pb-7 text-white">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-white/60 uppercase">
              <span>Fit Planet · {tp(`name.${booking.passType}`)}</span>
              <span className={cn("rounded-full px-2.5 py-1 font-sans text-xs font-semibold tracking-normal normal-case", status.tone)}>{status.label}</span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-4xl font-semibold tracking-[0.06em] text-volt">{cityCode(booking.gym.city)}</p>
                <p className="mt-1 truncate text-xl font-semibold tracking-[-0.02em]">{booking.gym.name}</p>
                <p className="truncate text-sm text-white/65">
                  {booking.gym.area}, {booking.gym.city}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="mt-6 h-1.5 rounded-full bg-holo" />
          </div>

          {/* Perforation */}
          <div aria-hidden="true" className="relative h-0">
            <span className="absolute -top-3 -start-3 size-6 rounded-full bg-canvas" />
            <span className="absolute -top-3 -end-3 size-6 rounded-full bg-canvas" />
            <span className="absolute inset-x-5 top-0 border-t-2 border-dashed border-ink/15" />
          </div>

          <div className="px-6 pt-8 pb-6">
            <div className={cn("mx-auto w-fit rounded-3xl bg-white p-4 ring-1 ring-gray-900/[0.06]", !usable && "opacity-30 grayscale")}>
              <PassQR code={booking.code} size={216} />
            </div>
            <p className="mt-4 text-center font-mono text-lg font-semibold tracking-[0.14em] text-ink" dir="ltr">
              {booking.code}
            </p>
            <p className="mt-1 text-center text-xs text-gray-500">
              {usable ? t("showDesk") : t("unusable")}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-gray-900/[0.06] pt-6 text-sm">
              <div className="col-span-2">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{t("valid")}</dt>
                <dd className="mt-1 font-semibold text-ink">{dates}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{t("holder")}</dt>
                <dd className="mt-1 truncate font-semibold text-ink">{booking.guest.name}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{booking.paymentMethod === "desk" ? t("payDesk") : t("paid")}</dt>
                <dd className="mt-1 font-semibold whitespace-nowrap text-ink">{formatMoney(booking.amount, booking.currency)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{t("entry")}</dt>
                <dd className="mt-1 font-semibold text-ink">{booking.passType === "day" ? t("single") : t("onceDay")}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{t("checkins")}</dt>
                <dd className="mt-1 font-semibold text-ink tabular-nums">{booking.checkinCount}</dd>
              </div>
            </dl>
          </div>
          <MrzLine
            className="overflow-hidden border-t border-gray-900/[0.06] bg-canvas/60 px-6 py-3"
            text={`FP<${booking.passType.toUpperCase()}<${cityCode(booking.gym.city)}<${booking.code.replace(/-/g, "")}<<${booking.startDate.replace(/-/g, "")}`}
          />
        </article>

        {/* Actions */}
        <aside className="mt-6 space-y-3 lg:mt-0">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <HiOutlineMapPin className="size-4.5" />
                {t("directions")}
              </a>
            )}
            <Link
              href={`/gyms/${booking.gym.slug}`}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-surface text-sm font-semibold text-ink shadow-soft ring-1 ring-gray-900/[0.06] hover:bg-white"
            >
              <HiOutlineArrowTopRightOnSquare className="size-4.5" />
              {t("gymPage")}
            </Link>
          </div>
          {gymDoc?.policies?.cancellation && (
            <div className="rounded-3xl bg-surface p-5 text-sm shadow-soft ring-1 ring-gray-900/[0.05]">
              <p className="font-semibold text-ink">{t("cancellation")}</p>
              <p className="mt-1 leading-relaxed text-gray-600">{gymDoc.policies.cancellation}</p>
            </div>
          )}
          {canCancel && (
            <CancelBookingButton
              bookingId={booking.id}
              refundNote={booking.paymentStatus === "paid" ? t("refundNote") : t("nothingCharged")}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
