import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiCheck,
  HiMagnifyingGlass,
  HiMapPin,
  HiOutlineBolt,
  HiStar,
} from "react-icons/hi2";
import { FauxQR } from "@/components/brand/FauxQR";
import { mockGyms } from "@/lib/data/mock-gyms";
import { heroStats, launchAreas, platformStats } from "@/lib/data/mock-platform";

const featuredGym = mockGyms[0];
const capacityPct = Math.round(
  (featuredGym.capacity.current / featuredGym.capacity.max) * 100,
);

const Hero: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-[8%] size-[28rem] animate-blob rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute top-20 right-[4%] size-[24rem] animate-blob rounded-full bg-volt/40 blur-3xl [animation-delay:-6s]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 pt-12 pb-20 sm:px-6 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8 lg:pt-20 lg:pb-28">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <Link
            href="/gyms"
            className="group inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-900/[0.07] bg-surface/80 py-1.5 pr-3 pl-1.5 text-[13px] font-medium text-gray-700 shadow-soft backdrop-blur"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500" />
                <span className="relative size-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            {platformStats.partnerGyms} partner gyms across {platformStats.launchCity}
            <HiArrowRight className="size-3.5 text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-7 animate-fade-up text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-ink [animation-delay:80ms] text-balance-safe sm:text-6xl lg:text-[4.4rem]">
            Every gym in your city,{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden="true"
                className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.38em] -rotate-1 rounded-sm bg-volt"
              />
              <span className="font-serif font-normal tracking-[-0.02em] italic">
                one tap
              </span>
            </span>{" "}
            away.
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-gray-600 [animation-delay:160ms] lg:mx-0">
            Discover gyms near you, compare day passes and memberships, and walk
            in with a QR code. No cards, no contracts, no front desk forms.
          </p>

          {/* Search */}
          <form
            action="/gyms"
            className="mx-auto mt-9 flex max-w-xl animate-fade-up items-center gap-1.5 rounded-full border border-gray-900/[0.07] bg-surface p-1.5 shadow-lift [animation-delay:240ms] lg:mx-0"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search by gym or area
            </label>
            <HiMapPin className="ml-3.5 size-5 shrink-0 text-emerald-600" />
            <input
              id="hero-search"
              name="q"
              type="text"
              autoComplete="off"
              placeholder="Search Clifton, DHA, Gulshan..."
              className="h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:px-6"
            >
              <HiMagnifyingGlass className="size-4.5" />
              <span className="hidden sm:inline">Search gyms</span>
            </button>
          </form>

          <div className="mt-4 flex animate-fade-up flex-wrap items-center justify-center gap-2 [animation-delay:300ms] lg:justify-start">
            <span className="text-[13px] text-gray-400">Popular:</span>
            {launchAreas.slice(0, 4).map((area) => (
              <Link
                key={area}
                href={`/gyms?q=${encodeURIComponent(area)}`}
                className="rounded-full border border-gray-900/[0.07] bg-surface/70 px-3 py-1 text-[13px] text-gray-600 transition-colors hover:border-gray-300 hover:text-ink"
              >
                {area}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <dl className="mx-auto mt-12 grid max-w-xl animate-fade-up grid-cols-2 gap-y-6 [animation-delay:380ms] sm:grid-cols-4 lg:mx-0">
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index > 0
                    ? "sm:border-l sm:border-gray-900/[0.08] sm:pl-5"
                    : ""
                }
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight text-ink tabular-nums">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-[13px] leading-snug text-gray-500">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[26rem] animate-fade-up [animation-delay:200ms]">
          {/* Phone */}
          <div className="relative mx-auto w-[18.5rem] rounded-[2.75rem] bg-ink p-2.5 shadow-[0_40px_80px_-24px_oklch(0.2_0.01_60/0.45)] sm:w-[20rem]">
            <div className="overflow-hidden rounded-[2.25rem] bg-canvas">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-3.5 pb-2 text-[11px] font-semibold text-ink">
                <span>9:41</span>
                <span className="h-5 w-20 rounded-full bg-ink" />
                <span className="flex items-center gap-1">
                  <span className="h-2 w-3.5 rounded-[3px] border border-ink" />
                </span>
              </div>

              <div className="px-4 pb-5">
                <div className="flex items-center justify-between py-2">
                  <p className="text-[13px] font-semibold text-ink">Your pass</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
                    Active
                  </span>
                </div>

                {/* Gym card */}
                <div className="relative h-32 overflow-hidden rounded-2xl">
                  <Image
                    src={featuredGym.coverImage}
                    alt=""
                    fill
                    priority
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="text-[15px] font-semibold leading-tight">
                      {featuredGym.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
                      <HiMapPin className="size-3" />
                      {featuredGym.address.area} · {featuredGym.distance} km
                    </p>
                  </div>
                </div>

                {/* QR */}
                <div className="mt-3 rounded-2xl bg-surface p-4 shadow-soft">
                  <div className="relative mx-auto w-fit overflow-hidden rounded-xl bg-white p-2">
                    <FauxQR seed={featuredGym.slug} size={132} />
                    <span className="absolute inset-x-0 top-0 h-1/2 animate-scan">
                      <span className="block h-0.5 w-full bg-emerald-500 shadow-[0_0_12px_2px] shadow-emerald-400/70" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="text-gray-400">Pass</p>
                      <p className="font-semibold text-ink">Day pass</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Valid</p>
                      <p className="font-semibold text-ink">
                        Today, {featuredGym.hours.open} to {featuredGym.hours.close}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex h-11 items-center justify-center rounded-full bg-ink text-[13px] font-medium text-white">
                  Show at entrance
                </div>
              </div>
            </div>
          </div>

          {/* Floating: capacity */}
          <div className="absolute top-16 -left-2 w-44 animate-float rounded-2xl border border-gray-900/[0.06] bg-surface/90 p-3.5 shadow-lift backdrop-blur sm:-left-10">
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
              Live capacity
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500" />
                <span className="relative size-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <p className="mt-1 text-xl font-semibold tracking-tight text-ink tabular-nums">
              {capacityPct}%
              <span className="ml-1 text-[11px] font-medium text-emerald-600">
                Quiet now
              </span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>

          {/* Floating: booked */}
          <div className="absolute -right-1 bottom-28 flex animate-float-slow items-center gap-3 rounded-2xl border border-gray-900/[0.06] bg-surface/90 py-3 pr-4 pl-3 shadow-lift backdrop-blur sm:-right-8">
            <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink">
              <HiCheck className="size-4.5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-ink">Booked in 45s</p>
              <p className="text-[11px] text-gray-500">
                Rs. {featuredGym.pricing.dayPass} · Day pass
              </p>
            </div>
          </div>

          {/* Floating: rating */}
          <div className="absolute bottom-6 -left-1 hidden animate-float items-center gap-2 rounded-full border border-gray-900/[0.06] bg-surface/90 py-2 pr-3.5 pl-2 shadow-lift backdrop-blur [animation-delay:-3s] sm:-left-6 sm:flex">
            <span className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <HiStar className="size-4" />
            </span>
            <span className="text-[13px] font-semibold text-ink">
              {featuredGym.rating}
            </span>
            <span className="text-[11px] text-gray-500">
              {featuredGym.totalReviews} reviews
            </span>
          </div>

          <HiOutlineBolt
            aria-hidden="true"
            className="absolute -top-4 right-6 size-10 rotate-12 text-emerald-500/40"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
