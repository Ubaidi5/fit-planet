"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { filterOptions } from "@/lib/data/mock-gyms";
import {
  HiCheck,
  HiChevronDown,
  HiMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiXMark,
} from "react-icons/hi2";

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  initialSearch?: string;
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

export const initialFilters: FilterState = {
  search: "",
  sortBy: "distance",
  distance: Infinity,
  priceRange: null,
  amenities: [],
  equipmentTypes: [],
  is24Hours: false,
  isVerified: false,
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-300 ease-out-expo active:scale-95",
        active
          ? "bg-ink text-white shadow-soft"
          : "bg-surface text-gray-600 ring-1 ring-gray-900/[0.08] hover:text-ink hover:ring-gray-900/15",
      )}
    >
      {active && <HiCheck className="size-3.5" />}
      {children}
    </button>
  );
}

function PillSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string | number;
  onChange: (value: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-full bg-surface pr-9 pl-3.5 text-sm font-medium text-gray-700 ring-1 ring-gray-900/[0.08] transition-shadow hover:ring-gray-900/15 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
      >
        {children}
      </select>
      <HiChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  initialSearch = "",
  className,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    search: initialSearch,
  });
  const [showPanel, setShowPanel] = useState(false);

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

  const clearFilters = () => {
    const cleared = { ...initialFilters, search: filters.search };
    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  const panelFiltersCount =
    filters.amenities.length +
    filters.equipmentTypes.length +
    (filters.priceRange ? 1 : 0);

  const activeFiltersCount =
    panelFiltersCount +
    (filters.distance !== Infinity ? 1 : 0) +
    (filters.is24Hours ? 1 : 0) +
    (filters.isVerified ? 1 : 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="flex items-center gap-1.5 rounded-full border border-gray-900/[0.07] bg-surface p-1.5 shadow-soft transition-shadow focus-within:shadow-lift focus-within:ring-4 focus-within:ring-emerald-500/10">
        <HiMagnifyingGlass className="ml-3.5 size-5 shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search gyms by name or area"
          aria-label="Search gyms by name or area"
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => updateFilters({ search: "" })}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-900/5 hover:text-gray-700"
            aria-label="Clear search"
          >
            <HiXMark className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowPanel((open) => !open)}
          aria-expanded={showPanel}
          aria-controls="filters-panel"
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
            showPanel ? "bg-ink text-white" : "bg-canvas text-gray-800 hover:bg-canvas-deep",
          )}
        >
          <HiOutlineAdjustmentsHorizontal className="size-4.5" />
          <span className="hidden sm:inline">Filters</span>
          {panelFiltersCount > 0 && (
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                showPanel ? "bg-volt text-ink" : "bg-ink text-white",
              )}
            >
              {panelFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick row */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <PillSelect
          label="Sort by"
          value={filters.sortBy}
          onChange={(value) => updateFilters({ sortBy: value })}
        >
          {filterOptions.sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </PillSelect>

        <PillSelect
          label="Distance"
          value={filters.distance}
          onChange={(value) => updateFilters({ distance: Number(value) })}
        >
          {filterOptions.distanceRanges.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </PillSelect>

        <span className="mx-1 hidden h-5 w-px bg-gray-900/10 sm:block" />

        <Chip
          active={filters.is24Hours}
          onClick={() => updateFilters({ is24Hours: !filters.is24Hours })}
        >
          {!filters.is24Hours && <HiOutlineClock className="size-4" />}
          Open 24/7
        </Chip>
        <Chip
          active={filters.isVerified}
          onClick={() => updateFilters({ isVerified: !filters.isVerified })}
        >
          {!filters.isVerified && <HiOutlineCheckBadge className="size-4" />}
          Verified
        </Chip>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-9 shrink-0 rounded-full px-3 text-sm font-medium text-gray-500 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Panel */}
      <div
        id="filters-panel"
        className={cn(
          "grid transition-all duration-500 ease-out-expo",
          showPanel ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_2fr_2fr]">
            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Day pass price
              </legend>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={filters.priceRange === null}
                  onClick={() => updateFilters({ priceRange: null })}
                >
                  Any
                </Chip>
                {filterOptions.priceRanges.map((range) => (
                  <Chip
                    key={range.label}
                    active={
                      filters.priceRange?.min === range.min &&
                      filters.priceRange?.max === range.max
                    }
                    onClick={() =>
                      updateFilters({
                        priceRange: { min: range.min, max: range.max },
                      })
                    }
                  >
                    {range.label}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Amenities
              </legend>
              <div className="flex flex-wrap gap-2">
                {filterOptions.amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    active={filters.amenities.includes(amenity)}
                    onClick={() => toggleArrayFilter("amenities", amenity)}
                  >
                    {amenity}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Training style
              </legend>
              <div className="flex flex-wrap gap-2">
                {filterOptions.equipmentTypes.map((type) => (
                  <Chip
                    key={type}
                    active={filters.equipmentTypes.includes(type)}
                    onClick={() => toggleArrayFilter("equipmentTypes", type)}
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchFilters };
