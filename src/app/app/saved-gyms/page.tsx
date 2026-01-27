"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// Mock saved gyms data
const mockSavedGyms = [
  {
    id: "gym-1",
    name: "FitZone Premium",
    location: "Clifton, Karachi",
    address: "Plot 12, Block 5, Clifton",
    rating: 4.8,
    reviewCount: 324,
    priceRange: { day: 500, week: 2500, month: 8000 },
    amenities: ["AC", "Parking", "Showers", "Lockers", "Trainers"],
    distance: "1.2 km",
    isOpen: true,
    savedAt: "2026-01-15",
    hasOffer: true,
    offerText: "20% off on monthly pass",
  },
  {
    id: "gym-2",
    name: "Iron Paradise",
    location: "DHA Phase 5",
    address: "Commercial Area, DHA Phase 5",
    rating: 4.6,
    reviewCount: 189,
    priceRange: { day: 600, week: 3000, month: 9500 },
    amenities: ["AC", "Parking", "Sauna", "Pool"],
    distance: "2.5 km",
    isOpen: true,
    savedAt: "2026-01-10",
    hasOffer: false,
  },
  {
    id: "gym-3",
    name: "Muscle Factory",
    location: "Gulshan-e-Iqbal",
    address: "Block 13-D, Gulshan",
    rating: 4.4,
    reviewCount: 256,
    priceRange: { day: 400, week: 2000, month: 6500 },
    amenities: ["AC", "Parking", "Trainers"],
    distance: "4.0 km",
    isOpen: false,
    savedAt: "2026-01-05",
    hasOffer: true,
    offerText: "Free trial day available",
  },
  {
    id: "gym-4",
    name: "Elite Fitness Club",
    location: "Bahria Town",
    address: "Midway Commercial, Bahria Town",
    rating: 4.9,
    reviewCount: 412,
    priceRange: { day: 800, week: 4000, month: 12000 },
    amenities: [
      "AC",
      "Parking",
      "Showers",
      "Lockers",
      "Trainers",
      "Sauna",
      "Pool",
      "Cafe",
    ],
    distance: "8.5 km",
    isOpen: true,
    savedAt: "2025-12-20",
    hasOffer: false,
  },
];

type SortOption = "recent" | "rating" | "distance" | "price";

export default function SavedGymsPage() {
  const [savedGyms, setSavedGyms] = useState(mockSavedGyms);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const filteredGyms = savedGyms
    .filter(
      (gym) =>
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "price":
          return a.priceRange.day - b.priceRange.day;
        case "recent":
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
    });

  const removeSavedGym = (gymId: string) => {
    setSavedGyms((prev) => prev.filter((gym) => gym.id !== gymId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Saved Gyms
          </h1>
          <p className="mt-1 text-gray-500">
            Your favorite gyms for quick access
          </p>
        </div>
        <Link href="/gyms">
          <Button>
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Discover More
          </Button>
        </Link>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search saved gyms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-48">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            options={[
              { value: "recent", label: "Recently Saved" },
              { value: "rating", label: "Highest Rated" },
              { value: "distance", label: "Nearest First" },
              { value: "price", label: "Lowest Price" },
            ]}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-xl">
              ❤️
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedGyms.length}
              </p>
              <p className="text-sm text-gray-500">Saved Gyms</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-xl">
              🏷️
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedGyms.filter((g) => g.hasOffer).length}
              </p>
              <p className="text-sm text-gray-500">With Offers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-xl">
              ✅
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {savedGyms.filter((g) => g.isOpen).length}
              </p>
              <p className="text-sm text-gray-500">Open Now</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gyms List */}
      {filteredGyms.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
            ❤️
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No saved gyms found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? "Try a different search term"
              : "Start saving gyms you want to try"}
          </p>
          <Link href="/gyms">
            <Button className="mt-4">Discover Gyms</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredGyms.map((gym) => (
            <Card key={gym.id} className="overflow-hidden">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white">
                      {gym.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {gym.name}
                        </h3>
                        {gym.hasOffer && (
                          <Badge variant="warning" size="sm">
                            Offer
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{gym.location}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-amber-600">
                          <span>⭐</span>
                          {gym.rating}
                          <span className="text-gray-400">
                            ({gym.reviewCount})
                          </span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{gym.distance}</span>
                        <span className="text-gray-400">•</span>
                        <span
                          className={
                            gym.isOpen ? "text-emerald-600" : "text-red-500"
                          }
                        >
                          {gym.isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSavedGym(gym.id)}
                    className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove from saved"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Offer Banner */}
                {gym.hasOffer && gym.offerText && (
                  <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    🏷️ {gym.offerText}
                  </div>
                )}

                {/* Amenities */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {gym.amenities.slice(0, 5).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {amenity}
                    </span>
                  ))}
                  {gym.amenities.length > 5 && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      +{gym.amenities.length - 5}
                    </span>
                  )}
                </div>

                {/* Price Range */}
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Starting from:</span>
                  <span className="font-semibold text-emerald-600">
                    Rs. {gym.priceRange.day}/day
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link href={`/gyms/${gym.id}`} className="flex-1">
                    <Button variant="outline" fullWidth>
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/gyms/${gym.id}#booking`} className="flex-1">
                    <Button fullWidth>Book Now</Button>
                  </Link>
                </div>

                {/* Saved Date */}
                <p className="mt-3 text-xs text-gray-400">
                  Saved on{" "}
                  {new Date(gym.savedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
