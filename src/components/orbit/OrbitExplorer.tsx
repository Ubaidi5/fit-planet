"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight, HiMapPin, HiOutlineClock, HiStar } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cityCode } from "@/lib/data/cities";
import type { Gym } from "@/lib/data/mock-gyms";

interface OrbitExplorerProps {
  gyms: Gym[];
  initialCity?: string;
  /** Show the row of city tabs above the orbit */
  showCityTabs?: boolean;
  className?: string;
}

export function crowdOf(gym: Gym) {
  const pct = Math.round((gym.capacity.current / gym.capacity.max) * 100);
  if (pct >= 80) return { pct, label: "Busy", color: "var(--color-stamp-magenta)", text: "text-stamp-magenta" };
  if (pct >= 50) return { pct, label: "Moderate", color: "var(--color-stamp-ochre)", text: "text-stamp-ochre" };
  return { pct, label: "Quiet", color: "var(--color-stamp-teal)", text: "text-stamp-teal" };
}

interface PlacedGym {
  gym: Gym;
  x: number;
  y: number;
  ring: number;
}

/**
 * Places gyms around the viewer: the radius follows distance, and the order
 * around the circle follows each gym's real bearing from the city centre,
 * spaced evenly so nodes never collide.
 */
function placeGyms(gyms: Gym[]): PlacedGym[] {
  if (gyms.length === 0) return [];
  const centre = {
    lat: gyms.reduce((sum, g) => sum + g.location.lat, 0) / gyms.length,
    lng: gyms.reduce((sum, g) => sum + g.location.lng, 0) / gyms.length,
  };
  const maxDistance = Math.max(...gyms.map((g) => g.distance ?? 1), 1);

  const withBearing = gyms
    .map((gym) => {
      const dLat = gym.location.lat - centre.lat;
      const dLng = (gym.location.lng - centre.lng) * Math.cos((centre.lat * Math.PI) / 180);
      return { gym, bearing: Math.atan2(-dLat, dLng) };
    })
    .sort((a, b) => a.bearing - b.bearing);

  const start = withBearing[0].bearing;
  const step = (Math.PI * 2) / withBearing.length;

  return withBearing.map(({ gym }, index) => {
    const angle = start + step * index;
    const ratio = (gym.distance ?? maxDistance) / maxDistance;
    // Keep nodes between the inner and outer rings (as % of the half-width)
    const radius = 30 + ratio * 58;
    return {
      gym,
      x: 50 + (Math.cos(angle) * radius) / 2,
      y: 50 + (Math.sin(angle) * radius) / 2,
      ring: ratio < 0.4 ? 0 : ratio < 0.75 ? 1 : 2,
    };
  });
}

export function OrbitExplorer({
  gyms,
  initialCity,
  showCityTabs = true,
  className,
}: OrbitExplorerProps) {
  const { money, distance, clock } = useLocale();
  const cities = useMemo(() => Array.from(new Set(gyms.map((g) => g.address.city))), [gyms]);
  const [city, setCity] = useState(initialCity && cities.includes(initialCity) ? initialCity : cities[0]);
  const cityGyms = useMemo(() => gyms.filter((g) => g.address.city === city), [gyms, city]);
  const placed = useMemo(() => placeGyms(cityGyms), [cityGyms]);

  const quietest = useMemo(
    () => [...cityGyms].sort((a, b) => crowdOf(a).pct - crowdOf(b).pct)[0],
    [cityGyms],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cityGyms.find((g) => g.id === selectedId) ?? quietest;

  const chooseCity = (next: string) => {
    setCity(next);
    setSelectedId(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {showCityTabs && (
        <div
          role="tablist"
          aria-label="Choose a city"
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
        >
          {cities.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={name === city}
              onClick={() => chooseCity(name)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-300 ease-out-expo",
                name === city
                  ? "bg-ink text-white shadow-soft"
                  : "bg-surface text-gray-600 ring-1 ring-gray-900/[0.08] hover:text-ink",
              )}
            >
              <span className={cn("font-mono text-[11px] tracking-[0.12em]", name === city ? "text-volt" : "text-gray-400")}>
                {cityCode(name)}
              </span>
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        {/* Orbit */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--color-volt-soft)_0%,transparent_68%)]" />
          <div aria-hidden="true" className="absolute inset-[3%] animate-[spin_160s_linear_infinite] rounded-full border border-dashed border-gray-900/15" />
          <div aria-hidden="true" className="absolute inset-[19%] rounded-full border border-gray-900/10" />
          <div aria-hidden="true" className="absolute inset-[34%] rounded-full border border-gray-900/10" />

          {/* You */}
          <div className="absolute top-1/2 left-1/2 z-10 flex size-[20%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink text-white shadow-[0_0_0_10px_oklch(0.6_0.1_190/0.12),0_0_0_22px_oklch(0.6_0.1_190/0.06)]">
            <span className="text-[10px] text-white/60 sm:text-[11px]">You</span>
            <span className="font-mono text-xs tracking-[0.14em] text-volt sm:text-sm">{cityCode(city)}</span>
          </div>

          {placed.map(({ gym, x, y }, index) => {
            const crowd = crowdOf(gym);
            const isSelected = gym.id === selected?.id;
            return (
              <button
                key={`${city}-${gym.id}`}
                type="button"
                onClick={() => setSelectedId(gym.id)}
                aria-pressed={isSelected}
                aria-label={`${gym.name}, ${crowd.pct}% full, ${distance(gym.distance ?? 0)} away`}
                className="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 animate-fade-up flex-col items-center gap-1.5 focus-visible:outline-none"
                style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${index * 70}ms` }}
              >
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-full p-[4px] transition-transform duration-500 ease-out-expo group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-emerald-500/30",
                    isSelected ? "size-16 sm:size-[4.5rem]" : "size-12 sm:size-14",
                  )}
                  style={{
                    background: `conic-gradient(${crowd.color} 0 ${crowd.pct}%, var(--color-gray-200) 0)`,
                  }}
                >
                  {isSelected && (
                    <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full" style={{ background: crowd.color, opacity: 0.25 }} />
                  )}
                  <span className="relative flex size-full items-center justify-center rounded-full bg-surface font-mono text-[11px] font-semibold text-ink tabular-nums">
                    {crowd.pct}%
                  </span>
                </span>
                <span
                  className={cn(
                    "max-w-28 truncate rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors sm:text-xs",
                    isSelected ? "bg-ink text-white" : "bg-surface/90 text-gray-700 shadow-soft",
                  )}
                >
                  {gym.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected gym */}
        {selected && (
          <div key={selected.id} className="animate-fade-up overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface p-2 shadow-lift">
            <div className="relative aspect-16/10 overflow-hidden rounded-[1.6rem]">
              <Image src={selected.coverImage} alt={selected.name} fill sizes="(max-width: 1024px) 100vw, 480px" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
              <span className="glass absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-ink uppercase">
                {cityCode(selected.address.city)} · {selected.country}
              </span>
              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className="text-2xl font-semibold tracking-[-0.03em]">{selected.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/85">
                  <HiMapPin className="size-4" />
                  {selected.address.area} · {distance(selected.distance ?? 0)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-900/[0.06] px-2 py-4 text-center rtl:divide-x-reverse">
              <div>
                <p className={cn("text-xl font-semibold tabular-nums", crowdOf(selected).text)}>{crowdOf(selected).pct}%</p>
                <p className="text-xs text-gray-500">{crowdOf(selected).label} now</p>
              </div>
              <div>
                <p className="flex items-center justify-center gap-1 text-xl font-semibold text-ink">
                  <HiStar className="size-4 text-stamp-ochre" />
                  {selected.rating}
                </p>
                <p className="text-xs text-gray-500">{selected.totalReviews} reviews</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-ink tabular-nums">{money(selected.pricing.dayPass, selected.currency)}</p>
                <p className="text-xs text-gray-500">Day pass</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-3 pb-3">
              <p className="flex min-w-0 items-center gap-1.5 text-sm text-gray-500">
                <HiOutlineClock className="size-4 shrink-0" />
                <span className="truncate">
                  {selected.hours.is24Hours ? "Open 24/7" : `${clock(selected.hours.open)} to ${clock(selected.hours.close)}`}
                </span>
              </p>
              <Link
                href={`/gyms/${selected.slug}`}
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink ps-5 pe-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                View gym
                <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 rtl:rotate-180">
                  <HiArrowRight className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
