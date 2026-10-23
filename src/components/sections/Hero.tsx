import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HiArrowRight, HiMagnifyingGlass, HiMapPin } from "react-icons/hi2";
import { MrzLine } from "@/components/passport/MrzLine";
import { PassWallet } from "@/components/passport/PassWallet";
import { Accent } from "@/components/sections/SectionHeading";
import { cityCode } from "@/lib/data/cities";
import type { Gym } from "@/lib/types";
import type { PlatformStats } from "@/server/modules/platform";

/** Median time from opening the app to a confirmed pass */
const BOOKING_SECONDS = 45;

const Hero = async ({ stats, cities, gyms }: { stats: PlatformStats; cities: string[]; gyms: Gym[] }) => {
  const t = await getTranslations("hero");
  const heroStats = [
    ...(stats.gyms > 0
      ? [
          { key: "gyms", value: String(stats.gyms) },
          { key: "cities", value: String(stats.cities.length) },
          { key: "currencies", value: String(stats.currencies) },
        ]
      : []),
    { key: "speed", value: `${BOOKING_SECONDS}s` },
  ];
  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-line-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 end-[-10%] size-[44rem] rounded-full border border-dashed border-gray-900/10" />
        <div className="absolute -top-16 end-[2%] size-[28rem] rounded-full border border-gray-900/[0.06]" />
        <div className="absolute top-10 end-[10%] size-[26rem] animate-blob rounded-full bg-volt/35 blur-3xl" />
        <div className="absolute bottom-0 start-[-6%] size-[22rem] animate-blob rounded-full bg-stamp-violet/10 blur-3xl [animation-delay:-7s]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-20 px-4 pt-10 pb-24 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8 lg:pt-20 lg:pb-32">
        {/* Copy */}
        <div className="min-w-0 text-center lg:text-start">
          <div className="mask-fade-x mx-auto max-w-md overflow-hidden lg:mx-0">
            <MrzLine text="Fit Planet Passport Every City" className="animate-fade-up" />
          </div>

          {stats.gyms > 0 && (
            <Link
              href="/gyms"
              className="group mt-6 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-900/[0.07] bg-surface/80 py-1.5 ps-1.5 pe-3 text-[13px] font-medium text-gray-700 shadow-soft backdrop-blur [animation-delay:60ms]"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] tracking-[0.1em] text-volt">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-volt" />
                  <span className="relative size-1.5 rounded-full bg-volt" />
                </span>
                {t("liveBadge")}
              </span>
              {t("live", { gyms: stats.gyms, cities: stats.cities.length })}
              <HiArrowRight className="size-3.5 text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          )}

          <h1 className="mt-6 animate-fade-up text-[2.75rem] leading-[0.98] font-bold tracking-[-0.05em] text-ink [animation-delay:120ms] text-balance-safe sm:text-[4.25rem] lg:text-[5rem]">
            {t.rich("title", { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-gray-600 [animation-delay:180ms] lg:mx-0">
            {t("lead")}
          </p>

          {/* Search */}
          <form
            action="/gyms"
            className="mx-auto mt-9 flex max-w-xl animate-fade-up items-center gap-1 rounded-full border border-gray-900/[0.07] bg-surface p-1.5 shadow-lift [animation-delay:240ms] lg:mx-0"
          >
            <label htmlFor="hero-city" className="sr-only">
              {t("city")}
            </label>
            <div className="relative flex h-12 shrink-0 items-center">
              <HiMapPin aria-hidden="true" className="pointer-events-none absolute start-3 size-4.5 text-emerald-600" />
              <select
                id="hero-city"
                name="city"
                defaultValue=""
                className="h-12 cursor-pointer appearance-none rounded-full bg-gray-100 ps-9 pe-4 font-mono text-[13px] font-medium tracking-[0.08em] text-ink focus:outline-none"
              >
                <option value="">{t("all")}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {cityCode(city)}
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor="hero-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <input
              id="hero-search"
              name="q"
              type="text"
              autoComplete="off"
              placeholder={t("searchPlaceholder")}
              className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t("searchGyms")}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-6"
            >
              <HiMagnifyingGlass className="size-4.5" />
              <span className="hidden sm:inline">{t("search")}</span>
            </button>
          </form>

          <div className="mt-4 flex animate-fade-up flex-wrap items-center justify-center gap-2 [animation-delay:300ms] lg:justify-start">
            {cities.slice(0, 5).map((city) => (
              <Link
                key={city}
                href={`/gyms?city=${encodeURIComponent(city)}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-900/[0.07] bg-surface/70 py-1 ps-1.5 pe-3 text-[13px] text-gray-600 transition-colors hover:border-gray-300 hover:text-ink"
              >
                <span className="rounded-full bg-gray-100 px-1.5 py-px font-mono text-[10px] tracking-[0.08em] text-gray-500 transition-colors group-hover:bg-volt group-hover:text-ink">
                  {cityCode(city)}
                </span>
                {city}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <dl className="mx-auto mt-12 grid max-w-xl animate-fade-up grid-cols-2 gap-y-6 border-t border-dashed border-gray-900/15 pt-6 [animation-delay:380ms] sm:grid-cols-4 lg:mx-0">
            {heroStats.map((stat, index) => (
              <div
                key={stat.key}
                className={`flex flex-col ${index > 0 ? "sm:border-s sm:border-gray-900/[0.08] sm:ps-5" : ""}`}
              >
                <dt className="order-2 mt-1 font-mono text-[11px] leading-snug tracking-[0.08em] text-gray-500 uppercase">
                  {t(`stats.${stat.key}`)}
                </dt>
                <dd className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Wallet */}
        <div className="px-6 sm:px-10 lg:px-4">
          <PassWallet gyms={gyms} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
