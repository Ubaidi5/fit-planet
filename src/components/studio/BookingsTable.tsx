"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowDownTray, HiOutlineEllipsisHorizontal, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import type { BookingView } from "@/lib/types";
import { passMeta } from "@/lib/passes";
import { formatDate } from "@/lib/dates";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { exportBookingsCsvAction, markDeskPaidAction, ownerCancelBookingAction } from "@/actions/studio";
import { useToast } from "@/components/notifications/ToastProvider";

const statusTabs = [
  ["all", "All"],
  ["active", "Active"],
  ["upcoming", "Upcoming"],
  ["past", "Past"],
  ["cancelled", "Cancelled"],
] as const;

function statusBadge(b: BookingView) {
  if (b.status === "cancelled") return { label: "Cancelled", cls: "bg-gray-900/[0.06] text-gray-500" };
  if (b.status === "refunded") return { label: "Refunded", cls: "bg-gray-900/[0.06] text-gray-500" };
  if (b.status === "expired") return { label: "Used", cls: "bg-gray-900/[0.06] text-gray-600" };
  if (b.isActive) return { label: "Active", cls: "bg-emerald-50 text-emerald-700" };
  return { label: "Upcoming", cls: "bg-stamp-violet/10 text-stamp-violet" };
}

export function BookingsTable({ bookings, focusId }: { bookings: BookingView[]; focusId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const { money } = useLocale();
  const [pending, startTransition] = useTransition();
  const [menu, setMenu] = useState<string | null>(null);
  const [q, setQ] = useState(params.get("q") ?? "");
  const status = params.get("status") ?? "all";
  const pass = params.get("pass") ?? "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("focus");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>) =>
    startTransition(async () => {
      const result = await fn();
      setMenu(null);
      if (result.ok) {
        toast.success(result.message ?? "Done");
        router.refresh();
      } else toast.error("Something went wrong", result.error);
    });

  const exportCsv = () =>
    startTransition(async () => {
      const result = await exportBookingsCsvAction();
      if (!result.ok) return toast.error("Export failed", result.error);
      const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: result.data.filename });
      a.click();
      URL.revokeObjectURL(url);
    });

  const Actions = ({ b }: { b: BookingView }) => {
    const canPay = b.status === "confirmed" && b.paymentMethod === "desk" && b.paymentStatus !== "paid";
    const canCancel = b.status === "confirmed" && !b.lastCheckinAt;
    if (!canPay && !canCancel) return null;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenu(menu === b.id ? null : b.id)}
          aria-label="Booking actions"
          aria-expanded={menu === b.id}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-900/5 hover:text-ink"
        >
          <HiOutlineEllipsisHorizontal className="size-5" />
        </button>
        {menu === b.id && (
          <div className="absolute end-0 top-10 z-20 w-48 rounded-2xl bg-surface p-1.5 text-sm shadow-lift ring-1 ring-gray-900/[0.06]">
            {canPay && (
              <button type="button" disabled={pending} onClick={() => run(() => markDeskPaidAction(b.id))} className="w-full cursor-pointer rounded-xl px-3 py-2 text-start font-medium text-ink hover:bg-canvas">
                Mark as paid
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => ownerCancelBookingAction(b.id))}
                className="w-full cursor-pointer rounded-xl px-3 py-2 text-start font-medium text-red-600 hover:bg-red-50"
              >
                Cancel {b.paymentStatus === "paid" && b.paymentMethod === "online" ? "and refund" : "booking"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {statusTabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setParam("status", value === "all" ? "" : value)}
              className={cn(
                "h-9 shrink-0 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors",
                status === value ? "bg-ink text-white" : "bg-surface text-gray-600 ring-1 ring-gray-900/[0.06] hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setParam("q", q.trim());
            }}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-surface ps-3.5 ring-1 ring-gray-900/[0.08] focus-within:ring-2 focus-within:ring-emerald-500/40 lg:w-72 lg:flex-none"
          >
            <HiOutlineMagnifyingGlass className="size-4 shrink-0 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, phone or code"
              className="h-full min-w-0 flex-1 bg-transparent pe-3 text-sm placeholder:text-gray-400 focus:outline-none"
            />
          </form>
          <select
            value={pass}
            onChange={(e) => setParam("pass", e.target.value)}
            aria-label="Pass type"
            className="h-10 shrink-0 cursor-pointer rounded-full bg-surface px-3.5 text-sm ring-1 ring-gray-900/[0.08] focus:outline-none"
          >
            <option value="">All passes</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <button
            type="button"
            onClick={exportCsv}
            disabled={pending}
            className="hidden h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink ring-1 ring-gray-900/[0.08] hover:bg-white sm:inline-flex"
          >
            <HiOutlineArrowDownTray className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-14 text-center text-sm text-gray-500">No bookings match these filters.</div>
      ) : (
        <>
          {/* Mobile cards: the essentials */}
          <ul className="mt-5 space-y-2.5 md:hidden">
            {bookings.map((b) => {
              const badge = statusBadge(b);
              return (
                <li
                  key={b.id}
                  className={cn("rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05]", focusId === b.id && "ring-2 ring-emerald-500")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-ink">{b.guest.name}</p>
                      <p className="text-sm text-gray-500">
                        {passMeta[b.passType].label} · {formatDate(b.startDate)}
                        {b.startDate !== b.endDate && ` to ${formatDate(b.endDate)}`}
                      </p>
                    </div>
                    <Actions b={b} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", badge.cls)}>{badge.label}</span>
                      {b.paymentMethod === "desk" && b.paymentStatus !== "paid" && b.status === "confirmed" && (
                        <span className="rounded-full bg-stamp-ochre/10 px-2 py-0.5 text-xs font-semibold text-stamp-ochre">Collect at desk</span>
                      )}
                    </div>
                    <span className="font-semibold whitespace-nowrap text-ink tabular-nums">{money(b.amount, b.currency)}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop table: full detail */}
          <div className="mt-5 hidden overflow-visible rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05] md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-900/[0.06] font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">
                  <th className="px-5 py-3 text-start font-medium">Member</th>
                  <th className="px-3 py-3 text-start font-medium">Pass</th>
                  <th className="px-3 py-3 text-start font-medium">Validity</th>
                  <th className="px-3 py-3 text-start font-medium">Status</th>
                  <th className="hidden px-3 py-3 text-start font-medium lg:table-cell">Payment</th>
                  <th className="hidden px-3 py-3 text-center font-medium xl:table-cell">Visits</th>
                  <th className="px-3 py-3 text-end font-medium">Amount</th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/[0.05]">
                {bookings.map((b) => {
                  const badge = statusBadge(b);
                  return (
                    <tr key={b.id} className={cn("hover:bg-canvas/40", focusId === b.id && "bg-volt-soft/50")}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{b.guest.name}</p>
                        <p className="text-xs text-gray-500">
                          {[b.guest.phone, b.guest.email].filter(Boolean).join(" · ") || <span className="font-mono">{b.code}</span>}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-gray-800">{passMeta[b.passType].label}</p>
                        <p className="font-mono text-[11px] text-gray-400">{b.code}</p>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-700">
                        {formatDate(b.startDate)}
                        {b.startDate !== b.endDate && ` to ${formatDate(b.endDate)}`}
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap", badge.cls)}>{badge.label}</span>
                      </td>
                      <td className="hidden px-3 py-3 lg:table-cell">
                        <span className="text-gray-700">{b.paymentMethod === "desk" ? "At desk" : "Online"}</span>
                        <span className={cn("ms-1.5 text-xs font-semibold", b.paymentStatus === "paid" ? "text-emerald-700" : "text-stamp-ochre")}>
                          {b.paymentStatus === "paid" ? "Paid" : b.paymentStatus === "refunded" ? "Refunded" : "Due"}
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 text-center text-gray-700 tabular-nums xl:table-cell">{b.checkinCount}</td>
                      <td className="px-3 py-3 text-end font-semibold whitespace-nowrap text-ink tabular-nums">{money(b.amount, b.currency)}</td>
                      <td className="px-3 py-3 text-end">
                        <Actions b={b} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
