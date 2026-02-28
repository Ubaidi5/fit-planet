"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { filterOptions } from "@/lib/data/mock-gyms";
import {
  HiOutlineSearch,
  HiOutlineAdjustments,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
} from "react-icons/hi";

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  search: string;
  sortBy: string;
  distance: number;
  priceRange: { min: number; max: number } | null;
  amenities: string[];
  equipmentTypes: string[];
  is24Hours: boolean;
  isVerified: boolean;
}

const initialFilters: FilterState = {
  search: "",
  sortBy: "distance",
  distance: Infinity,
  priceRange: null,
  amenities: [],
  equipmentTypes: [],
  is24Hours: false,
  isVerified: false,
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  className,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "amenities",
  ]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleArrayFilter = (
    key: "amenities" | "equipmentTypes",
    value: string,
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [key]: updated });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onFilterChange?.(initialFilters);
  };

  const activeFiltersCount =
    filters.amenities.length +
    filters.equipmentTypes.length +
    (filters.priceRange ? 1 : 0) +
    (filters.distance !== Infinity ? 1 : 0) +
    (filters.is24Hours ? 1 : 0) +
    (filters.isVerified ? 1 : 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search gyms by name or area..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors lg:hidden",
            showFilters
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
          )}
        >
          <HiOutlineAdjustments className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Sort & Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {filterOptions.sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Distance Dropdown */}
        <div className="relative">
          <select
            value={filters.distance}
            onChange={(e) =>
              updateFilters({ distance: Number(e.target.value) })
            }
            className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {filterOptions.distanceRanges.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Quick Toggle Filters */}
        <button
          type="button"
          onClick={() => updateFilters({ is24Hours: !filters.is24Hours })}
          className={cn(
            "h-10 rounded-lg border px-3 text-sm font-medium transition-colors",
            filters.is24Hours
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50",
          )}
        >
          24/7 Open
        </button>

        <button
          type="button"
          onClick={() => updateFilters({ isVerified: !filters.isVerified })}
          className={cn(
            "h-10 rounded-lg border px-3 text-sm font-medium transition-colors",
            filters.isVerified
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50",
          )}
        >
          <HiOutlineCheckCircle className="mr-1 inline h-4 w-4" />
          Verified Only
        </button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 rounded-lg px-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Expanded Filters Panel */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:block",
          showFilters
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100",
        )}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-4 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Price Range */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                Day Pass Price
              </h4>
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.priceRange?.min === range.min &&
                        filters.priceRange?.max === range.max
                      }
                      onChange={() =>
                        updateFilters({
                          priceRange: { min: range.min, max: range.max },
                        })
                      }
                      className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === null}
                    onChange={() => updateFilters({ priceRange: null })}
                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600">Any price</span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("amenities")}
                className="mb-3 flex w-full items-center justify-between text-sm font-medium text-gray-900"
              >
                Amenities
                <HiOutlineChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("amenities") && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid grid-cols-2 gap-2 overflow-hidden transition-all",
                  expandedSections.includes("amenities")
                    ? "max-h-96"
                    : "max-h-0",
                )}
              >
                {filterOptions.amenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => toggleArrayFilter("amenities", amenity)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equipment Types */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("equipment")}
                className="mb-3 flex w-full items-center justify-between text-sm font-medium text-gray-900"
              >
                Equipment Types
                <HiOutlineChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedSections.includes("equipment") && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid grid-cols-2 gap-2 overflow-hidden transition-all",
                  expandedSections.includes("equipment")
                    ? "max-h-96"
                    : "max-h-0",
                )}
              >
                {filterOptions.equipmentTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.equipmentTypes.includes(type)}
                      onChange={() => toggleArrayFilter("equipmentTypes", type)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchFilters };
