import Link from "next/link";
import type { BookingDoc } from "@/server/db/models";
import { formatMoney } from "@/lib/i18n/format";
import { adminCancelBookingAction } from "@/actions/admin";
import { Pill } from "./bits";
import { ConfirmAction } from "./AdminForms";
import { bookingStatusTone, paymentLabel } from "./labels";

const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

/** One pass in an admin list; `show` picks which side of the booking to link to */
export function BookingRow({ booking: b, gymName, show }: { booking: BookingDoc; gymName: string; show: "gym" | "member" | "both" }) {
  const refundable = b.paymentStatus === "paid" && b.paymentMethod === "online";
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[13px] font-semibold tracking-wide text-ink">{b.code}</span>
          <Pill tone={bookingStatusTone[b.status]}>{b.status[0].toUpperCase() + b.status.slice(1)}</Pill>
          <Pill tone={b.paymentStatus === "paid" ? "green" : b.paymentStatus === "failed" ? "red" : "gray"}>
            {paymentLabel[b.paymentStatus]} · {b.paymentMethod === "online" ? "online" : "at desk"}
          </Pill>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">
          {show !== "member" && (
            <>
              <Link href={`/admin/gyms/${b.gymId.toHexString()}`} className="font-medium text-ink hover:underline">
                {gymName}
              </Link>
              {" · "}
            </>
          )}
          {show !== "gym" && (
            <>
              <Link href={`/admin/users/${b.userId.toHexString()}`} className="font-medium text-ink hover:underline">
                {b.guest.name || "Member"}
              </Link>
              {" · "}
            </>
          )}
          {b.passType} pass from {b.startDate}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">Booked {date.format(b.createdAt)}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-[15px] font-semibold text-ink tabular-nums">{formatMoney(b.amount, b.currency)}</span>
        {b.status === "confirmed" && (
          <ConfirmAction
            action={adminCancelBookingAction}
            fields={{ bookingId: b._id.toHexString() }}
            label={refundable ? "Refund" : "Cancel"}
            confirm={refundable ? "Refund now" : "Cancel pass"}
          />
        )}
      </div>
    </li>
  );
}
