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
import { ownerPreview } from "@/lib/data/mock-platform";
import { Accent, SectionHeading } from "./SectionHeading";

const benefits = [
  {
    title: "No software hassle",
    description: "A polished listing and booking flow without building a website or app.",
    icon: HiOutlineComputerDesktop,
  },
  {
    title: "Capacity control",
    description: "Set limits per hour and stop overcrowding before it happens.",
    icon: HiOutlinePresentationChartLine,
  },
  {
    title: "Flexible pricing",
    description: "Day, week and monthly passes, add-ons and custom packages.",
    icon: HiOutlineCurrencyDollar,
  },
  {
    title: "QR check-ins",
    description: "Scan and verify members instantly. No paper registers.",
    icon: HiOutlineQrCode,
  },
  {
    title: "Analytics",
    description: "Bookings, revenue, peak hours and member insights at a glance.",
    icon: HiOutlineChartBar,
  },
  {
    title: "Promotions",
    description: "Discount codes, seasonal offers and referral programs.",
    icon: HiOutlineTag,
  },
];

const days = ["M", "T", "W", "T", "F", "S", "S"];

const ForGymOwners: React.FC = () => {
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
              eyebrow="For gym owners"
              title={
                <>
                  Run your gym like a <Accent>modern business</Accent>
                </>
              }
              description="Most gyms still run on WhatsApp and paper registers. Fit Planet Studio brings bookings, capacity, pricing and payouts into one place, and sends you new members."
            />

            <div className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Reveal key={benefit.title} delay={index * 60} className="flex gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-emerald-700 shadow-soft ring-1 ring-gray-900/[0.05]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {benefit.description}
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
                List your gym free
                <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                  <HiArrowRight className="size-4" />
                </span>
              </Link>
              <Link
                href="/studio/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-900/10 bg-surface px-6 text-[15px] font-medium text-gray-800 transition-colors hover:border-gray-300"
              >
                Studio login
              </Link>
            </Reveal>
          </div>

          {/* Dashboard preview */}
          <Reveal delay={120} className="relative">
            <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift sm:p-6">
              <div className="flex items-center justify-between border-b border-gray-900/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-sm font-bold text-volt">
                    FZ
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{ownerPreview.gymName}</p>
                    <p className="text-xs text-gray-500">Studio dashboard</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Open now
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { label: "Check-ins today", value: ownerPreview.checkInsToday },
                  {
                    label: "Revenue today",
                    value: new Intl.NumberFormat("en", {
                      style: "currency",
                      currency: "PKR",
                      currencyDisplay: "narrowSymbol",
                      notation: "compact",
                    }).format(ownerPreview.revenueToday),
                  },
                  { label: "In the gym", value: `${capacityPct}%` },
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
                  <p className="text-sm font-medium text-ink">Weekly bookings</p>
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
                        <p className="text-[11px] text-gray-500">{checkin.time}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-volt-soft px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                      {checkin.pass}
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
                <p className="text-xs font-semibold text-ink">Weekly payout sent</p>
                <p className="text-[11px] text-gray-500">Every Monday</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ForGymOwners;
