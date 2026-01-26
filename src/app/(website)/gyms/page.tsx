"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GymCard } from "@/components/gyms/GymCard";
import { SearchFilters, FilterState } from "@/components/gyms/SearchFilters";
import { mockGyms } from "@/lib/data/mock-gyms";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

export default function GymsPage() {
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filter and sort gyms based on current filters
  const filteredGyms = useMemo(() => {
    let result = [...mockGyms];

    if (filters) {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (gym) =>
            gym.name.toLowerCase().includes(searchLower) ||
            gym.address.area.toLowerCase().includes(searchLower) ||
            gym.address.city.toLowerCase().includes(searchLower),
        );
      }

      // Distance filter
      if (filters.distance !== Infinity) {
        result = result.filter(
          (gym) => gym.distance && gym.distance <= filters.distance,
        );
      }

      // Price filter
      if (filters.priceRange) {
        result = result.filter(
          (gym) =>
            gym.pricing.dayPass >= filters.priceRange!.min &&
            gym.pricing.dayPass <= filters.priceRange!.max,
        );
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        result = result.filter((gym) =>
          filters.amenities.every((amenity) => gym.amenities.includes(amenity)),
        );
      }

      // Equipment filter
      if (filters.equipmentTypes.length > 0) {
        result = result.filter((gym) =>
          filters.equipmentTypes.some((type) =>
            gym.equipmentTypes.includes(type),
          ),
        );
      }

      // 24/7 filter
      if (filters.is24Hours) {
        result = result.filter((gym) => gym.hours.is24Hours);
      }

      // Verified filter
      if (filters.isVerified) {
        result = result.filter((gym) => gym.isVerified);
      }

      // Sort
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
    }

    return result;
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Find Your Perfect Gym
            </h1>
            <p className="mt-4 text-lg text-emerald-100">
              Discover {mockGyms.length}+ gyms near you. Compare prices,
              amenities, and book instantly.
            </p>
          </div>

          {/* Location Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-lg">
              <div className="relative flex-1">
                <svg
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your location or area..."
                  defaultValue="Karachi"
                  className="h-12 w-full rounded-lg bg-transparent pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Use My Location</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <SearchFilters onFilterChange={setFilters} className="mb-8" />

          {/* Results Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredGyms.length}
                </span>{" "}
                gyms
                {filters?.search && (
                  <span>
                    {" "}
                    for &quot;
                    <span className="font-medium">{filters.search}</span>&quot;
                  </span>
                )}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-500 hover:text-gray-700",
                )}
                aria-label="Grid view"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-500 hover:text-gray-700",
                )}
                aria-label="List view"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Gym Grid/List */}
          {filteredGyms.length > 0 ? (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4",
              )}
            >
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No gyms found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search for a different area.
              </p>
              <button
                type="button"
                onClick={() => setFilters(null)}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More (Placeholder) */}
          {filteredGyms.length > 0 && (
            <div className="mt-12 text-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                  />
                </svg>
                Load More Gyms
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Own a Gym?</h2>
          <p className="mt-2 text-gray-600">
            List your gym on Fit Planet and reach thousands of fitness
            enthusiasts.
          </p>
          <Link
            href="/studio/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Register Your Gym
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
