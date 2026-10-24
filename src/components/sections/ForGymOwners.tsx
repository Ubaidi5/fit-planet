import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  HiArrowRight,
  HiArrowTrendingUp,
  HiOutlineChartBar,
  HiOutlineComputerDesktop,
  HiOutlineCurrencyDollar,
  HiOutlinePresentationChartLine,
  HiOutlineQrCode,
  HiOutlineTag,
} from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { getRegion } from "@/lib/i18n/server";
import { Accent, SectionHeading } from "./SectionHeading";

const benefits = [
  { key: "noSoftware", icon: HiOutlineComputerDesktop },
  { key: "occupancy", icon: HiOutlinePresentationChartLine },
  { key: "pricing", icon: HiOutlineCurrencyDollar },
  { key: "checkins", icon: HiOutlineQrCode },
  { key: "analytics", icon: HiOutlineChartBar },
  { key: "reviews", icon: HiOutlineTag },
];


/** Illustrative studio dashboard; the numbers are a sample, not live data */
const ownerPreview = {
  gymName: "Northside Strength",
  initials: "NS",
  checkInsToday: 42,
  capacity: { current: 32, max: 50 },
  weeklyBookings: [38, 52, 44, 68, 61, 79, 88],
  weeklyGrowth: 12,
  recentCheckIns: [
    { name: "Lena M.", minutesAgo: 2, pass: "day" },
    { name: "Omar K.", minutesAgo: 5, pass: "month" },
    { name: "Sara D.", minutesAgo: 12, pass: "week" },
  ],
} as const;

/** A believable day's takings in currencies where 1,240 would look odd */
const revenueIn: Record<string, number> = { TRY: 42_000, AED: 4_600, SAR: 4_700, JPY: 185_000, PKR: 345_000, INR: 104_000 };

const ForGymOwners = async () => {
  const [t, tp, region] = await Promise.all([getTranslations("owners"), getTranslations("passes.name"), getRegion()]);
  const minutesAgo = new Intl.RelativeTimeFormat(region.locale, { numeric: "auto", style: "short" });
  const days = t("days").split(",");
  const maxBookings = Math.max(...ownerPreview.weeklyBookings);
  const capacityPct = Math.round(
    (ownerPreview.capacity.current / ownerPreview.capacity.max) * 100,
  );

  return (
    <section id="for-owners" className="px-3 sm:px-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-gray-900/[0.06] bg-canvas-deep py-20 lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="relative grid items-center gap-14 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14">
          <div>
            <SectionHeading
              align="left"
              eyebrow={t("eyebrow")}
              title={t.rich("title", { accent: (c) => <Accent>{c}</Accent> })}
              description={t("lead")}
            />

            <div className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Reveal key={benefit.key} delay={index * 60} className="flex gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-emerald-700 shadow-soft ring-1 ring-gray-900/[0.05]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">{t(`benefits.${benefit.key}.title`)}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {t(`benefits.${benefit.key}.text`)}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink pe-1.5 ps-6 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
              >
                {t("ctaList")}
                <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                  <HiArrowRight className="size-4" />
                </span>
              </Link>
              <Link
                href="/studio/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-900/10 bg-surface px-6 text-[15px] font-medium text-gray-800 transition-colors hover:border-gray-300"
              >
                {t("ctaLogin")}
              </Link>
            </Reveal>
          </div>

          {/* Dashboard preview */}
          <Reveal delay={120} className="relative">
            <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift sm:p-6">
              <div className="flex items-center justify-between border-b border-gray-900/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-sm font-bold text-volt">
                    {ownerPreview.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{ownerPreview.gymName}</p>
                    <p className="text-xs text-gray-500">{t("preview.dashboard")}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {t("preview.open")}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { label: t("preview.checkins"), value: ownerPreview.checkInsToday },
                  {
                    label: t("preview.revenue"),
                    value: new Intl.NumberFormat(region.locale, {
                      style: "currency",
                      currency: region.currency,
                      currencyDisplay: "narrowSymbol",
                      notation: "compact",
                    }).format(revenueIn[region.currency] ?? 1_240),
                  },
                  { label: t("preview.inGym"), value: `${capacityPct}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-canvas p-3 sm:p-4">
                    <p className="text-lg font-semibold tracking-tight text-ink tabular-nums sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl bg-canvas p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{t("preview.weekly")}</p>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <HiArrowTrendingUp className="size-3.5" />+{ownerPreview.weeklyGrowth}%
                  </span>
                </div>
                <div className="flex h-28 items-end gap-2">
                  {ownerPreview.weeklyBookings.map((value, index) => {
                    const isToday = index === ownerPreview.weeklyBookings.length - 1;
                    return (
                      <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div
                          className={
                            isToday
                              ? "w-full rounded-lg bg-emerald-600"
                              : "w-full rounded-lg bg-emerald-200/70"
                          }
                          style={{ height: `${(value / maxBookings) * 100}%` }}
                        />
                        <span className="text-[10px] font-medium text-gray-400">{days[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {ownerPreview.recentCheckIns.map((checkin) => (
                  <div
                    key={checkin.name}
                    className="flex items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-canvas"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                        {checkin.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{checkin.name}</p>
                        <p className="text-[11px] text-gray-500">{minutesAgo.format(-checkin.minutesAgo, "minute")}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-volt-soft px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                      {tp(checkin.pass)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating payout chip */}
            <div className="absolute -top-5 -right-2 hidden animate-float items-center gap-2.5 rounded-2xl border border-gray-900/[0.06] bg-surface py-2.5 pe-4 ps-2.5 shadow-lift sm:flex lg:-right-6">
              <span className="flex size-8 items-center justify-center rounded-xl bg-volt text-ink">
                <HiOutlineCurrencyDollar className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">{t("preview.payoutTitle")}</p>
                <p className="text-[11px] text-gray-500">{t("preview.payoutText")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ForGymOwners;
