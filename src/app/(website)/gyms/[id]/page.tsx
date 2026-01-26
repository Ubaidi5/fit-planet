"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { mockGyms } from "@/lib/data/mock-gyms";
import {
  gymDetails,
  getGymDetails,
  generateDefaultDetails,
} from "@/lib/data/mock-gym-details";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PhotoGallery } from "@/components/gyms/PhotoGallery";
import { PricingCard } from "@/components/gyms/PricingCard";
import { ReviewCard, ReviewsSummary } from "@/components/gyms/ReviewCard";
import {
  CapacityIndicator,
  CrowdChart,
} from "@/components/gyms/CapacityIndicator";
import { BookingModal } from "@/components/booking/BookingModal";

// Tabs for the page
type TabType = "overview" | "pricing" | "classes" | "trainers" | "reviews";

export default function GymDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const params = useParams();
  // Find the gym from mock data - support both id and slug
  const gym = mockGyms.find((g) => g.id === params.id || g.slug === params.id);

  if (!gym) {
    notFound();
  }

  // Get detailed gym info (or generate default) - use gym.id for lookup
  const details = getGymDetails(gym.id) || generateDefaultDetails(gym.id);

  // Gallery images - combine base gym images with detailed gallery
  const galleryImages =
    details.gallery.length > 0
      ? details.gallery
      : gym.images.map((url, i) => ({
          url,
          caption: `Gym Photo ${i + 1}`,
          category: "Facility" as const,
        }));

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "classes", label: "Classes" },
    { id: "trainers", label: "Trainers" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 bg-gray-900">
        <Image
          src={gym.coverImage}
          alt={gym.name}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <Link
            href="/gyms"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Gyms
          </Link>
        </div>

        {/* Gym Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {gym.isFeatured && <Badge variant="warning">Featured</Badge>}
              {gym.isVerified && (
                <Badge variant="success">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </Badge>
              )}
              {gym.hours.is24Hours && <Badge variant="info">24/7 Open</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {gym.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <svg
                  className="h-5 w-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{gym.rating}</span>
                <span className="text-white/70">
                  ({gym.totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {gym.address.area}, {gym.address.city}
                </span>
              </div>

              {gym.distance && (
                <div className="flex items-center gap-1">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>{gym.distance} km away</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                      activeTab === tab.id
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  {/* Photo Gallery */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Photo Gallery
                    </h2>
                    <PhotoGallery images={galleryImages} />
                  </div>

                  {/* About */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      About {gym.name}
                    </h2>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {details.longDescription || gym.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Amenities & Facilities
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gym.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <svg
                            className="h-5 w-5 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  {details.equipment.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Equipment
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {details.equipment.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <span className="font-medium text-gray-900">
                                {item.name}
                              </span>
                              {item.brand && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({item.brand})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded",
                                  item.condition === "New"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : item.condition === "Good"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700",
                                )}
                              >
                                {item.condition}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Operating Hours */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Operating Hours
                    </h2>
                    <div className="space-y-2">
                      {details.operatingHours.map((day) => {
                        const today =
                          new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                          }) === day.day;
                        return (
                          <div
                            key={day.day}
                            className={cn(
                              "flex items-center justify-between py-2 px-3 rounded-lg",
                              today ? "bg-emerald-50" : "",
                            )}
                          >
                            <span
                              className={cn(
                                "font-medium",
                                today ? "text-emerald-700" : "text-gray-700",
                              )}
                            >
                              {day.day}
                              {today && (
                                <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">
                                  Today
                                </span>
                              )}
                            </span>
                            <span
                              className={cn(
                                day.isClosed
                                  ? "text-red-500"
                                  : today
                                    ? "text-emerald-600"
                                    : "text-gray-600",
                              )}
                            >
                              {day.isClosed
                                ? "Closed"
                                : `${day.open} - ${day.close}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popular Times */}
                  {details.crowdData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <CrowdChart data={details.crowdData} />
                    </div>
                  )}

                  {/* Policies */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Gym Policies
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(details.policies).map(([key, value]) => (
                        <div key={key}>
                          <h3 className="font-medium text-gray-900 capitalize mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <p className="text-sm text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Pricing Tab */}
              {activeTab === "pricing" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Membership Plans
                  </h2>
                  <PricingCard
                    dayPass={gym.pricing.dayPass}
                    weekPass={gym.pricing.weekPass}
                    monthPass={gym.pricing.monthPass}
                    annualPass={details.annualPass}
                    specialPackages={details.specialPackages}
                    onSelectPlan={() => setIsBookingOpen(true)}
                  />
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === "classes" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Group Classes
                    </h2>

                    {details.classes.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <svg
                          className="h-12 w-12 mx-auto mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>No group classes available at this gym</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {details.classes.map((cls) => (
                          <div
                            key={cls.id}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                          >
                            {cls.image && (
                              <div className="relative h-40">
                                <Image
                                  src={cls.image}
                                  alt={cls.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {cls.name}
                                </h3>
                                <Badge
                                  variant={
                                    cls.difficulty === "Beginner"
                                      ? "success"
                                      : cls.difficulty === "Advanced"
                                        ? "danger"
                                        : "info"
                                  }
                                  size="sm"
                                >
                                  {cls.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {cls.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {cls.duration} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {cls.instructor}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <span className="text-emerald-600 font-medium">
                                    {cls.currentEnrolled}
                                  </span>
                                  <span className="text-gray-500">
                                    /{cls.maxParticipants} spots
                                  </span>
                                </div>
                                <Button size="sm">Book Class</Button>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">
                                  Schedule:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {cls.schedule.map((s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {s.day} {s.time}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trainers Tab */}
              {activeTab === "trainers" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Our Trainers
                    </h2>

                    {details.trainers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <svg
                          className="h-12 w-12 mx-auto mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <p>No trainer information available</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {details.trainers.map((trainer) => (
                          <div
                            key={trainer.id}
                            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={trainer.avatar}
                                  alt={trainer.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {trainer.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <svg
                                    className="h-4 w-4 text-amber-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-700">
                                    {trainer.rating}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({trainer.totalClients} clients)
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                              {trainer.bio}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {trainer.specializations.map((spec) => (
                                <span
                                  key={spec}
                                  className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <span>{trainer.experience} years exp.</span>
                              <span className="font-semibold text-gray-900">
                                Rs. {trainer.hourlyRate.toLocaleString()}/hr
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                              <span className="font-medium">Available:</span>{" "}
                              {trainer.availability}
                            </div>

                            <Button className="w-full" outline>
                              Book Session
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <ReviewsSummary
                    rating={gym.rating}
                    totalReviews={gym.totalReviews}
                    breakdown={details.ratingBreakdown}
                  />

                  {/* Write Review Button */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Share Your Experience
                        </h3>
                        <p className="text-sm text-gray-500">
                          Help others by sharing your honest review
                        </p>
                      </div>
                      <Button>Write a Review</Button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {details.reviews.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                      <svg
                        className="h-12 w-12 mx-auto mb-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {details.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:w-96">
            <div className="sticky top-4 space-y-4">
              {/* Quick Book Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Book a Pass
                </h3>

                {/* Current Capacity */}
                <div className="mb-4">
                  <CapacityIndicator
                    current={gym.capacity.current}
                    max={gym.capacity.max}
                  />
                </div>

                {/* Quick Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Day Pass</span>
                    <span className="font-semibold text-gray-900">
                      Rs. {gym.pricing.dayPass.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Week Pass</span>
                    <span className="font-semibold text-gray-900">
                      Rs. {gym.pricing.weekPass.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div>
                      <span className="text-emerald-700 font-medium">
                        Monthly Pass
                      </span>
                      <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">
                        Popular
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-700">
                      Rs. {gym.pricing.monthPass.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Instant confirmation • No hidden fees
                </p>
              </div>

              {/* Contact Info */}
              {details.contact.phone && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact
                  </h3>
                  <div className="space-y-3">
                    {details.contact.phone && (
                      <a
                        href={`tel:${details.contact.phone}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {details.contact.phone}
                      </a>
                    )}
                    {details.contact.email && (
                      <a
                        href={`mailto:${details.contact.email}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {details.contact.email}
                      </a>
                    )}
                    {details.contact.website && (
                      <a
                        href={details.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        Visit Website
                      </a>
                    )}
                  </div>

                  {/* Social Links */}
                  {(details.contact.instagram || details.contact.facebook) && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      {details.contact.instagram && (
                        <a
                          href={`https://instagram.com/${details.contact.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-lg hover:bg-pink-100 hover:text-pink-600 transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}
                      {details.contact.facebook && (
                        <a
                          href={`https://facebook.com/${details.contact.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Location Map Placeholder */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Location
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <svg
                      className="h-12 w-12 mx-auto mb-2 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-sm">Map integration coming soon</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {gym.address.street}, {gym.address.area}, {gym.address.city}
                </p>
                <Button outline className="w-full mt-3">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        gym={gym}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
