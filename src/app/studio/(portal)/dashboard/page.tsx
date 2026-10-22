import type { Metadata } from "next";
import Link from "next/link";
import {
  HiArrowRight,
  HiArrowTrendingDown,
  HiArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineQrCode,
  HiOutlineTicket,
} from "react-icons/hi2";
import { requireOwner } from "@/server/session";
import { ownerStats } from "@/server/modules/analytics";
import { formatMoney, listGymBookings } from "@/server/modules/bookings";
import { recentCheckins } from "@/server/modules/checkins";
import { PageHeader } from "@/components/studio/PageHeader";
import { RevenueBars } from "@/components/studio/charts/RevenueBars";
import { HourlyStrip } from "@/components/studio/charts/HourlyStrip";
import { OccupancyRing } from "@/components/studio/charts/OccupancyRing";
import { PushPrompt } from "@/components/notifications/PushManager";
import { formatDate } from "@/lib/dates";
import { passMeta } from "@/lib/passes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const card = "rounded-[1.75rem] border border-gray-900/[0.06] bg-surface shadow-soft";

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function StudioDashboardPage() {
  const { user, gyms, gym } = await requireOwner("/studio/dashboard");
  const gymIds = gyms.map((g) => g._id);
  const [stats, bookings, checkins] = await Promise.all([ownerStats(gyms), listGymBookings({ gymIds, status: "all", limit: 8 }), recentCheckins({ gymIds }, 8)]);

  const money = (n: number) => formatMoney(n, stats.currency);
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: gym.timezone }).format(new Date())) % 24;
  const trend = stats.revenuePrev30 > 0 ? Math.round(((stats.revenue30 - stats.revenuePrev30) / stats.revenuePrev30) * 100) : null;
  const totalMix = Object.values(stats.passMix).reduce((s, m) => s + m.count, 0) || 1;
  const firstName = (user.name ?? "there").split(" ")[0];

  const kpis = [
    { label: "Bookings today", value: String(stats.todayBookings), sub: `${stats.upcomingPasses} upcoming`, icon: HiOutlineTicket },
    { label: "Revenue today", value: money(stats.todayRevenue), sub: `${money(stats.revenue30)} in 30 days`, icon: HiOutlineBanknotes },
    { label: "Check-ins today", value: String(stats.todayCheckins), sub: `${stats.activePasses} active passes`, icon: HiOutlineCheckCircle },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow={`${greeting(hour)}, ${firstName}`}
        title="Today"
        description={`${gym.name} · ${formatDate(stats.today, "en", { weekday: "long", day: "numeric", month: "long" })}`}
        actions={
          <Link
            href="/studio/checkin"
            className="hidden h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 sm:inline-flex"
          >
            <HiOutlineQrCode className="size-4.5 text-volt" />
            Check in a member
          </Link>
        }
      />

      {/* Live + KPIs */}
      <div className="grid gap-4 lg:grid-cols-4">
        <section className={cn(card, "flex items-center gap-5 p-5 lg:flex-col lg:items-start lg:justify-between")}>
          <OccupancyRing current={stats.occupancy.current} max={stats.occupancy.max} size={112} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-emerald-700 uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">
              {stats.occupancy.current}
              <span className="text-base font-medium text-gray-400"> / {stats.occupancy.max}</span>
            </p>
            <p className="text-sm text-gray-500">people in the gym now</p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-3 lg:gap-4">
          {kpis.map(({ label, value, sub, icon: Icon }, i) => (
            <section key={label} className={cn(card, "p-4 sm:p-5", i === 2 && "col-span-2 sm:col-span-1")}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-gray-500">{label}</p>
                <span className="hidden size-8 items-center justify-center rounded-xl bg-canvas text-gray-600 sm:flex">
                  <Icon className="size-4.5" />
                </span>
              </div>
              <p className="mt-2 truncate text-2xl leading-tight font-semibold tracking-tight text-ink tabular-nums sm:text-[1.75rem]">{value}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{sub}</p>
            </section>
          ))}
        </div>
      </div>

      {stats.unpaidAtDesk > 0 && (
        <Link
          href="/studio/bookings?status=active"
          className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-stamp-ochre/10 px-5 py-3.5 text-sm text-stamp-ochre ring-1 ring-stamp-ochre/20"
        >
          <span>
            <span className="font-semibold">{stats.unpaidAtDesk} pay-at-desk {stats.unpaidAtDesk === 1 ? "booking" : "bookings"}</span> still to collect.
          </span>
          <HiArrowRight className="size-4 shrink-0 rtl:rotate-180" />
        </Link>
      )}

      <PushPrompt className="mt-4 lg:hidden" title="Get a ping for every booking" body="Turn on notifications and this phone buzzes the moment a member books a pass." />

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {/* Revenue (desktop and tablet) */}
        <section className={cn(card, "hidden p-6 sm:block lg:col-span-8")}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue · last 30 days</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-ink tabular-nums">{money(stats.revenue30)}</p>
            </div>
            {trend !== null && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                )}
              >
                {trend >= 0 ? <HiArrowTrendingUp className="size-3.5" /> : <HiArrowTrendingDown className="size-3.5" />}
                {trend >= 0 ? "+" : ""}
                {trend}% vs previous 30 days
              </span>
            )}
          </div>
          <div className="mt-6">
            <RevenueBars series={stats.series} format={money} />
          </div>
        </section>

        {/* Pass mix */}
        <section className={cn(card, "hidden p-6 sm:block lg:col-span-4")}>
          <p className="text-sm font-medium text-gray-500">Pass mix · 30 days</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-ink tabular-nums">{stats.bookings30}</p>
          <p className="text-sm text-gray-500">bookings</p>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-gray-100">
            {(["day", "week", "month"] as const).map((type, i) => (
              <div
                key={type}
                className={["bg-emerald-600", "bg-stamp-ochre", "bg-stamp-violet"][i]}
                style={{ width: `${(stats.passMix[type].count / totalMix) * 100}%` }}
              />
            ))}
          </div>
          <ul className="mt-5 space-y-3">
            {(["day", "week", "month"] as const).map((type, i) => (
              <li key={type} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2.5 text-gray-700">
                  <span className={cn("size-2.5 rounded-full", ["bg-emerald-600", "bg-stamp-ochre", "bg-stamp-violet"][i])} />
                  {passMeta[type].label}
                </span>
                <span className="text-end">
                  <span className="font-semibold text-ink tabular-nums">{stats.passMix[type].count}</span>
                  <span className="ms-2 text-gray-500 tabular-nums">{money(stats.passMix[type].revenue)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Latest bookings */}
        <section className={cn(card, "overflow-hidden lg:col-span-8")}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3 sm:px-6">
            <h2 className="text-base font-semibold text-ink">Latest bookings</h2>
            <Link href="/studio/bookings" className="text-sm font-semibold text-emerald-700">
              View all
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-gray-500">No bookings yet. Share your listing to get the first one.</p>
          ) : (
            <>
              {/* Mobile: cards */}
              <ul className="divide-y divide-gray-900/[0.06] sm:hidden">
                {bookings.slice(0, 5).map((b) => (
                  <li key={b.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-semibold text-ink">{b.guest.name.charAt(0)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{b.guest.name}</p>
                      <p className="truncate text-xs text-gray-500">
                        {passMeta[b.passType].short} · {formatDate(b.startDate)} · {timeAgo(b.createdAt)} ago
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-ink tabular-nums">{formatMoney(b.amount, b.currency)}</span>
                  </li>
                ))}
              </ul>
              {/* Desktop: table */}
              <table className="hidden w-full text-sm sm:table">
                <thead>
                  <tr className="border-y border-gray-900/[0.06] bg-canvas/50 text-start font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">
                    <th className="px-6 py-2.5 text-start font-medium">Member</th>
                    <th className="px-3 py-2.5 text-start font-medium">Pass</th>
                    <th className="px-3 py-2.5 text-start font-medium">Starts</th>
                    <th className="px-3 py-2.5 text-start font-medium">Payment</th>
                    <th className="px-6 py-2.5 text-end font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/[0.05]">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-canvas/40">
                      <td className="px-6 py-3">
                        <p className="font-medium text-ink">{b.guest.name}</p>
                        <p className="font-mono text-[11px] text-gray-400">{b.code}</p>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{passMeta[b.passType].label}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-700">{formatDate(b.startDate)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            b.status === "cancelled" || b.status === "refunded"
                              ? "bg-gray-900/[0.06] text-gray-500"
                              : b.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-stamp-ochre/10 text-stamp-ochre",
                          )}
                        >
                          {b.status === "cancelled" ? "Cancelled" : b.status === "refunded" ? "Refunded" : b.paymentStatus === "paid" ? "Paid" : "At desk"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-end font-semibold whitespace-nowrap text-ink tabular-nums">{formatMoney(b.amount, b.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>

        <div className="space-y-4 lg:col-span-4">
          <PushPrompt className="hidden lg:block" title="Get a ping for every booking" body="Turn on notifications and we'll alert this device the moment a member books." />

          {/* Live check-ins */}
          <section className={cn(card, "p-5 sm:p-6")}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Recent check-ins</h2>
              <Link href="/studio/checkin" className="text-sm font-semibold text-emerald-700">
                Scan
              </Link>
            </div>
            {checkins.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No one has checked in yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {checkins.slice(0, 6).map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-volt-soft text-xs font-semibold text-emerald-800">{c.memberName.charAt(0)}</span>
                    <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                      <span className="font-medium text-ink">{c.memberName}</span> · {passMeta[c.passType].short}
                    </p>
                    <span className="shrink-0 font-mono text-[11px] text-gray-400">{timeAgo(c.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Peak hours (desktop) */}
          <section className={cn(card, "hidden p-6 sm:block")}>
            <h2 className="text-base font-semibold text-ink">Peak hours</h2>
            <p className="mb-4 text-sm text-gray-500">Average check-ins per hour, last 30 days</p>
            <HourlyStrip hourly={stats.hourly} currentHour={hour} />
          </section>
        </div>
      </div>
    </div>
  );
}
