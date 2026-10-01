"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { countryName, localTimeIn } from "@/lib/i18n/format";
import { cityMeta } from "@/lib/data/cities";
import { gymCities, mockGyms } from "@/lib/data/mock-gyms";

const rows = gymCities.map((city) => {
  const gyms = mockGyms.filter((g) => g.address.city === city);
  const load =
    gyms.reduce((sum, g) => sum + g.capacity.current, 0) /
    gyms.reduce((sum, g) => sum + g.capacity.max, 0);
  const cheapest = gyms.reduce((min, g) => (g.pricing.dayPass < min.pricing.dayPass ? g : min), gyms[0]);
  return {
    city,
    meta: cityMeta[city],
    gyms: gyms.length,
    from: cheapest.pricing.dayPass,
    currency: cheapest.currency,
    load: Math.round(load * 100),
  };
});

function status(load: number) {
  if (load >= 75) return { label: "Busy", className: "bg-stamp-magenta/20 text-[oklch(0.8_0.12_5)]" };
  if (load >= 50) return { label: "Moderate", className: "bg-stamp-ochre/20 text-[oklch(0.85_0.12_80)]" };
  return { label: "Quiet", className: "bg-volt/15 text-volt" };
}

/** Split-flap style letters for the city code */
function FlapCode({ code }: { code: string }) {
  return (
    <span className="flex gap-0.5" aria-label={code}>
      {code.split("").map((char, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="relative flex h-8 w-6 items-center justify-center overflow-hidden rounded-[5px] bg-white/[0.07] font-mono text-base font-semibold text-white sm:h-9 sm:w-7 sm:text-lg"
        >
          {char}
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink/80" />
        </span>
      ))}
    </span>
  );
}

export default function Departures() {
  const { region, money } = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="px-3 py-6 sm:px-4">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-ink px-4 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(oklch(1_0_0/0.06)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute -top-32 end-[-8%] size-[30rem] rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] tracking-[0.16em] text-volt uppercase">Departures · Live</p>
            <h2 className="mt-3 max-w-xl text-[2rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance-safe sm:text-5xl">
              Wherever you land, your pass already works.
            </h2>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-white/60">
            Prices stay in each city&apos;s own currency. Times, distances and
            numbers follow your region.
          </p>
        </div>

        <div className="relative mt-10 sm:mt-12">
          {/* Column labels */}
          <div className="hidden grid-cols-[7rem_minmax(0,1fr)_6rem_5rem_7rem_7rem_2.5rem] gap-4 border-b border-white/10 pb-3 font-mono text-[11px] tracking-[0.14em] text-white/40 uppercase md:grid">
            <span>City</span>
            <span>Destination</span>
            <span>Local</span>
            <span>Gyms</span>
            <span>From</span>
            <span>Crowd</span>
            <span />
          </div>

          <ul>
            {rows.map((row, index) => {
              const state = status(row.load);
              return (
                <Reveal as="li" key={row.city} delay={index * 60}>
                  <Link
                    href={`/gyms?city=${encodeURIComponent(row.city)}`}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-white/10 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[7rem_minmax(0,1fr)_6rem_5rem_7rem_7rem_2.5rem] md:gap-4"
                  >
                    <FlapCode code={row.meta?.code ?? row.city.slice(0, 3).toUpperCase()} />
                    <span className="min-w-0">
                      <span className="block truncate text-[17px] font-medium">{row.city}</span>
                      <span className="block truncate text-[13px] text-white/50">
                        {row.meta ? countryName(row.meta.country, region.locale) : ""}
                      </span>
                    </span>
                    <span className="font-mono text-sm text-white/80 tabular-nums max-md:col-start-3 max-md:row-start-1 max-md:text-end">
                      {now && row.meta ? localTimeIn(row.meta.timezone, region.locale, now) : "--:--"}
                    </span>
                    <span className="font-mono text-sm text-white/70 tabular-nums max-md:hidden">
                      {String(row.gyms).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm text-white tabular-nums max-md:col-span-2 max-md:col-start-1">
                      <span className="text-white/40 md:hidden">From </span>
                      {money(row.from, row.currency)}
                    </span>
                    <span className="max-md:col-start-3 max-md:justify-self-end">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] uppercase ${state.className}`}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {state.label}
                      </span>
                    </span>
                    <span className="hidden size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-500 ease-out-expo group-hover:border-volt group-hover:bg-volt group-hover:text-ink md:flex rtl:-scale-x-100">
                      <HiArrowUpRight className="size-4" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
