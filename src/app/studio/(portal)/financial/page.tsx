import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { ownerStats } from "@/server/modules/analytics";
import { formatMoney, listGymBookings } from "@/server/modules/bookings";
import { env } from "@/server/env";
import { PageHeader } from "@/components/studio/PageHeader";
import { RevenueBars } from "@/components/studio/charts/RevenueBars";
import { formatDate } from "@/lib/dates";
import { getRegion } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("financial") };
}

const card = "rounded-[1.75rem] border border-gray-900/[0.06] bg-surface shadow-soft";

export default async function RevenuePage() {
  const { gyms } = await requireOwner("/studio/financial", { ownerOnly: true });
  const [stats, bookings] = await Promise.all([ownerStats(gyms), listGymBookings({ gymIds: gyms.map((g) => g._id), status: "all", limit: 60 })]);
  const [t, tp, region] = await Promise.all([getTranslations("studio.revenue"), getTranslations("passes"), getRegion()]);
  const locale = region.locale;
  const money = (n: number) => formatMoney(n, stats.currency, locale);
  const avg = stats.bookings30 > 0 ? stats.revenue30 / stats.bookings30 : 0;
  const fee = env.platformFee;
  const online30 = bookings.filter((b) => b.paymentMethod === "online" && b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0);
  const transactions = bookings.filter((b) => b.paymentStatus !== "unpaid" || b.status === "confirmed");

  const kpis = [
    { label: t("kpi.revenue"), value: money(stats.revenue30), sub: stats.revenuePrev30 ? t("kpi.revenuePrev", { amount: money(stats.revenuePrev30) }) : t("kpi.firstMonth") },
    { label: t("kpi.bookings"), value: String(stats.bookings30), sub: t("kpi.average", { amount: money(Math.round(avg)) }) },
    { label: t("kpi.collect"), value: String(stats.unpaidAtDesk), sub: t("kpi.collectHint") },
    { label: t("kpi.fee"), value: `${Math.round(fee * 100)}%`, sub: t("kpi.feeHint") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} description={t("currency", { currency: stats.currency })} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpis.map((k) => (
          <section key={k.label} className={cn(card, "p-4 sm:p-5")}>
            <p className="text-[13px] font-medium text-gray-500">{k.label}</p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-[1.75rem]">{k.value}</p>
            <p className="mt-1 truncate text-xs text-gray-500">{k.sub}</p>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <section className={cn(card, "hidden p-6 sm:block lg:col-span-8")}>
          <p className="text-sm font-medium text-gray-500">{t("daily")}</p>
          <div className="mt-5">
            <RevenueBars series={stats.series} format={money} locale={locale} />
          </div>
        </section>
        <section className={cn(card, "p-5 sm:p-6 lg:col-span-4")}>
          <p className="text-sm font-medium text-gray-500">{t("byType")}</p>
          <ul className="mt-4 divide-y divide-gray-900/[0.06]">
            {(["day", "week", "month"] as const).map((type) => (
              <li key={type} className="flex items-center justify-between py-3 text-sm">
                <span className="text-gray-700">{tp(`name.${type}`)}</span>
                <span className="text-end">
                  <span className="block font-semibold text-ink tabular-nums">{money(stats.passMix[type].revenue)}</span>
                  <span className="text-xs text-gray-500">{t("sold", { count: stats.passMix[type].count })}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-2xl bg-canvas p-4 text-sm">
            <p className="font-medium text-ink">{t("payouts")}</p>
            <p className="mt-1 leading-relaxed text-gray-600">
              {t("payoutsText", { amount: money(online30), fee: Math.round(fee * 100) })}
            </p>
          </div>
        </section>
      </div>

      <section className={cn(card, "mt-4 overflow-hidden")}>
        <h2 className="px-5 pt-5 pb-3 text-base font-semibold text-ink sm:px-6">{t("transactions")}</h2>
        <ul className="divide-y divide-gray-900/[0.06]">
          {transactions.slice(0, 40).map((b) => (
            <li key={b.id} className="flex items-center gap-3 px-5 py-3 text-sm sm:px-6">
              <span className="w-16 shrink-0 text-xs text-gray-500">{formatDate(b.createdAt.slice(0, 10), locale)}</span>
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium text-ink">{b.guest.name}</span>
                <span className="text-gray-500"> · {tp(`short.${b.passType}`)}</span>
              </span>
              <span className="hidden text-xs text-gray-500 sm:block">{b.paymentMethod === "desk" ? t("desk") : t("online")}</span>
              <span
                className={cn(
                  "shrink-0 font-semibold whitespace-nowrap tabular-nums",
                  b.paymentStatus === "refunded" ? "text-gray-400 line-through" : b.paymentStatus === "paid" ? "text-ink" : "text-stamp-ochre",
                )}
              >
                {formatMoney(b.amount, b.currency, locale)}
              </span>
            </li>
          ))}
          {transactions.length === 0 && <li className="px-6 py-8 text-center text-sm text-gray-500">{t("none")}</li>}
        </ul>
      </section>
    </div>
  );
}
