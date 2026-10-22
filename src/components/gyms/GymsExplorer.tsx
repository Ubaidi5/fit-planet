"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HiArrowRight,
  HiMagnifyingGlass,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { GymCard } from "@/components/gyms/GymCard";
import {
  SearchFilters,
  initialFilters,
  type FilterState,
} from "@/components/gyms/SearchFilters";
import { Reveal } from "@/components/motion/Reveal";
import { mockGyms } from "@/lib/data/mock-gyms";
import { platformStats } from "@/lib/data/mock-platform";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

function applyFilters(filters: FilterState) {
  let result = [...mockGyms];

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

  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    result = result.filter(
      (gym) => gym.pricing.dayPass >= min && gym.pricing.dayPass <= max,
    );
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
    case "price_asc":
      result.sort((a, b) => a.pricing.dayPass - b.pricing.dayPass);
      break;
    case "price_desc":
      result.sort((a, b) => b.pricing.dayPass - a.pricing.dayPass);
      break;
    case "reviews":
      result.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
  }

  return result;
}

export function GymsExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    search: initialQuery,
  });
  const [filtersKey, setFiltersKey] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredGyms = useMemo(() => applyFilters(filters), [filters]);

  const resetAll = () => {
    setFilters(initialFilters);
    setFiltersKey((key) => key + 1);
  };

  return (
    <main className="min-h-screen">
      {/* Intro */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 right-[10%] size-[26rem] rounded-full bg-volt/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 lg:px-8">
          <p className="animate-fade-up text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Explore · {platformStats.launchCity}
          </p>
          <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-ink [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            Find a gym that fits{" "}
            <span className="font-serif font-normal italic">your day</span>
          </h1>
          <p className="mt-4 max-w-2xl animate-fade-up text-lg text-gray-600 [animation-delay:160ms]">
            {platformStats.partnerGyms} verified partner gyms. Compare passes,
            amenities and how busy they are right now, then book in seconds.
          </p>

          <div className="mt-8 animate-fade-up [animation-delay:240ms]">
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

            <div className="flex items-center rounded-full bg-surface p-1 ring-1 ring-gray-900/[0.07]">
              {(
                [
                  { mode: "grid", icon: HiOutlineSquares2X2, label: "Grid view" },
                  { mode: "list", icon: HiOutlineListBullet, label: "List view" },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-label={label}
                  aria-pressed={viewMode === mode}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-all duration-300",
                    viewMode === mode
                      ? "bg-ink text-white shadow-soft"
                      : "text-gray-500 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {filteredGyms.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
                  : "grid gap-4",
              )}
            >
              {filteredGyms.map((gym, index) => (
                <Reveal key={gym.id} delay={(index % 4) * 70} className="flex">
                  <GymCard gym={gym} layout={viewMode} className="w-full" />
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
                Own a gym in {platformStats.launchCity}?
              </h2>
              <p className="mt-1.5 text-gray-700">
                List it on Fit Planet and start taking bookings from new members.
              </p>
            </div>
            <Link
              href="/studio/register"
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink pr-1.5 pl-6 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              List your gym
              <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                <HiArrowRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
