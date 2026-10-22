"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HiArrowRight,
  HiMagnifyingGlass,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
  HiOutlineViewfinderCircle,
} from "react-icons/hi2";
import { OrbitExplorer } from "@/components/orbit/OrbitExplorer";
import { cityCode } from "@/lib/data/cities";
import { GymCard } from "@/components/gyms/GymCard";
import {
  SearchFilters,
  initialFilters,
  type FilterState,
} from "@/components/gyms/SearchFilters";
import { Reveal } from "@/components/motion/Reveal";
import { cityAverageDayPass, gymCities, mockGyms } from "@/lib/data/mock-gyms";
import { platformStats } from "@/lib/data/mock-platform";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/sections/SectionHeading";

type ViewMode = "orbit" | "grid" | "list";

function applyFilters(filters: FilterState, city: string) {
  let result = city ? mockGyms.filter((gym) => gym.address.city === city) : [...mockGyms];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (gym) =>
        gym.name.toLowerCase().includes(searchLower) ||
        gym.address.area.toLowerCase().includes(searchLower) ||
        gym.address.city.toLowerCase().includes(searchLower),
    );
  }

  if (filters.distance !== Infinity) {
    result = result.filter(
      (gym) => gym.distance && gym.distance <= filters.distance,
    );
  }

  // Tiers are relative to each city's average, so they work in any currency
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    result = result.filter((gym) => {
      const ratio = gym.pricing.dayPass / cityAverageDayPass(gym.address.city);
      return ratio >= min && ratio < max;
    });
  }

  if (filters.amenities.length > 0) {
    result = result.filter((gym) =>
      filters.amenities.every((amenity) => gym.amenities.includes(amenity)),
    );
  }

  if (filters.equipmentTypes.length > 0) {
    result = result.filter((gym) =>
      filters.equipmentTypes.some((type) => gym.equipmentTypes.includes(type)),
    );
  }

  if (filters.is24Hours) result = result.filter((gym) => gym.hours.is24Hours);
  if (filters.isVerified) result = result.filter((gym) => gym.isVerified);

  switch (filters.sortBy) {
    case "distance":
      result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    // Different currencies can't be compared directly, so sort by how a
    // gym's price sits within its own city
    case "price_asc":
      result.sort((a, b) => relativePrice(a) - relativePrice(b));
      break;
    case "price_desc":
      result.sort((a, b) => relativePrice(b) - relativePrice(a));
      break;
    case "reviews":
      result.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
  }

  return result;
}

const relativePrice = (gym: (typeof mockGyms)[number]) =>
  gym.pricing.dayPass / cityAverageDayPass(gym.address.city);

const viewModes = [
  { mode: "orbit", icon: HiOutlineViewfinderCircle, label: "Orbit" },
  { mode: "grid", icon: HiOutlineSquares2X2, label: "Grid" },
  { mode: "list", icon: HiOutlineListBullet, label: "List" },
] as const;

interface GymsExplorerProps {
  initialQuery?: string;
  initialCity?: string;
}

export function GymsExplorer({ initialQuery = "", initialCity = "" }: GymsExplorerProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    search: initialQuery,
  });
  const [filtersKey, setFiltersKey] = useState(0);
  const [city, setCity] = useState(gymCities.includes(initialCity) ? initialCity : "");
  const [viewMode, setViewMode] = useState<ViewMode>(initialCity ? "orbit" : "grid");

  const filteredGyms = useMemo(() => applyFilters(filters, city), [filters, city]);
  // Orbit needs one city; with "All" selected it shows its own city tabs
  const orbitCities = useMemo(() => new Set(filteredGyms.map((gym) => gym.address.city)), [filteredGyms]);

  const resetAll = () => {
    setFilters(initialFilters);
    setCity("");
    setFiltersKey((key) => key + 1);
  };

  return (
    <main className="min-h-screen">
      {/* Intro */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 end-[10%] size-[26rem] rounded-full bg-volt/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 lg:px-8">
          <p className="animate-fade-up font-mono text-[12px] tracking-[0.16em] text-emerald-700 uppercase">
            Explore · {city ? `${cityCode(city)} · ${city}` : `${gymCities.length} cities`}
          </p>
          <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-ink [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            Find a gym that fits{" "}
            <Accent>your day</Accent>
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-lg text-gray-600 [animation-delay:160ms]">
            {platformStats.partnerGyms} verified partner gyms in {gymCities.length} cities.
            Compare passes in local currency, see how busy they are right now and
            book in seconds.
          </p>

          <div
            role="tablist"
            aria-label="Choose a city"
            className="-mx-4 mt-8 flex animate-fade-up gap-2 overflow-x-auto px-4 pb-1 no-scrollbar [animation-delay:200ms] sm:mx-0 sm:px-0"
          >
            {["", ...gymCities].map((name) => {
              const active = name === city;
              return (
                <button
                  key={name || "all"}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCity(name)}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-300 ease-out-expo",
                    active ? "bg-ink text-white shadow-soft" : "bg-surface text-gray-600 ring-1 ring-gray-900/[0.08] hover:text-ink",
                  )}
                >
                  <span className={cn("font-mono text-[11px] tracking-[0.12em]", active ? "text-volt" : "text-gray-400")}>
                    {name ? cityCode(name) : "ALL"}
                  </span>
                  {name || "Everywhere"}
                </button>
              );
            })}
          </div>

          <div className="mt-4 animate-fade-up [animation-delay:240ms]">
            <SearchFilters
              key={filtersKey}
              initialSearch={initialQuery}
              onFilterChange={setFilters}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500" aria-live="polite">
              <span className="font-semibold text-ink tabular-nums">
                {filteredGyms.length}
              </span>{" "}
              {filteredGyms.length === 1 ? "gym" : "gyms"}
              {filters.search && (
                <>
                  {" "}
                  for <span className="font-medium text-ink">&ldquo;{filters.search}&rdquo;</span>
                </>
              )}
            </p>

            <div className="flex shrink-0 items-center rounded-full bg-surface p-1 ring-1 ring-gray-900/[0.07]">
              {viewModes.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-label={`${label} view`}
                  aria-pressed={viewMode === mode}
                  className={cn(
                    "flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium transition-all duration-300 sm:px-3",
                    viewMode === mode ? "bg-ink text-white shadow-soft" : "text-gray-500 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {filteredGyms.length > 0 && viewMode === "orbit" ? (
            <div className="rounded-[2.5rem] border border-gray-900/[0.06] bg-surface/60 px-4 py-10 sm:px-8 lg:py-14">
              <OrbitExplorer
                key={`${city}-${orbitCities.size}-${filteredGyms.length}`}
                gyms={filteredGyms}
                initialCity={city}
                showCityTabs={!city && orbitCities.size > 1}
              />
            </div>
          ) : filteredGyms.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
                  : "grid gap-4",
              )}
            >
              {filteredGyms.map((gym, index) => (
                <Reveal key={gym.id} delay={(index % 4) * 70} className="flex">
                  <GymCard gym={gym} layout={viewMode === "list" ? "list" : "grid"} className="w-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-gray-300 bg-surface/60 px-6 py-20 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-canvas text-gray-400 ring-1 ring-gray-900/[0.06]">
                <HiMagnifyingGlass className="size-6" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-ink">No gyms match yet</h2>
              <p className="mt-1.5 max-w-sm text-sm text-gray-500">
                Try a different area or loosen a filter. New gyms join the
                network every week.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-6 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Reset search and filters
              </button>
            </div>
          )}

          {/* Owner banner */}
          <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-4xl border border-gray-900/[0.06] bg-volt-soft/70 p-7 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
                Own a gym{city ? ` in ${city}` : ""}?
              </h2>
              <p className="mt-1.5 text-gray-700">
                List it on Fit Planet and start taking bookings from new members.
              </p>
            </div>
            <Link
              href="/studio/register"
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink pe-1.5 ps-6 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              List your gym
              <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 rtl:rotate-180">
                <HiArrowRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
