"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineArrowLeft,
  HiOutlineBadgeCheck,
  HiStar,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
  HiOutlineCheck,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineChat,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineGlobe,
  HiOutlineMap,
} from "react-icons/hi";
import { FaInstagram, FaFacebook } from "react-icons/fa";
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
import { AddOnsSection } from "@/components/gyms/AddOnsSection";
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
            <HiOutlineArrowLeft className="h-5 w-5" />
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
                  <HiOutlineBadgeCheck className="h-3 w-3 mr-1" />
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
                <HiStar className="h-5 w-5 text-amber-400" />
                <span className="font-semibold">{gym.rating}</span>
                <span className="text-white/70">
                  ({gym.totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <HiOutlineLocationMarker className="h-5 w-5" />
                <span>
                  {gym.address.area}, {gym.address.city}
                </span>
              </div>

              {gym.distance && (
                <div className="flex items-center gap-1">
                  <HiOutlineTrendingUp className="h-5 w-5" />
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
                          <HiOutlineCheck className="h-5 w-5 text-emerald-500" />
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

                  {/* Add-Ons Section */}
                  {details.addOns && details.addOns.length > 0 && (
                    <AddOnsSection
                      addOns={details.addOns}
                      onSelectAddOn={() => setIsBookingOpen(true)}
                    />
                  )}

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
                        <HiOutlineCalendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                                  <HiOutlineClock className="h-4 w-4" />
                                  {cls.duration} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <HiOutlineUser className="h-4 w-4" />
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
                        <HiOutlineUserGroup className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                                  <HiStar className="h-4 w-4 text-amber-400" />
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

                            <Button fullWidth variant="outline">
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
                      <HiOutlineChat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                        <HiOutlinePhone className="h-5 w-5" />
                        {details.contact.phone}
                      </a>
                    )}
                    {details.contact.email && (
                      <a
                        href={`mailto:${details.contact.email}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <HiOutlineMail className="h-5 w-5" />
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
                        <HiOutlineGlobe className="h-5 w-5" />
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
                          className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <FaInstagram className="h-5 w-5" />
                        </a>
                      )}
                      {details.contact.facebook && (
                        <a
                          href={`https://facebook.com/${details.contact.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FaFacebook className="h-5 w-5" />
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
                    <HiOutlineMap className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Map integration coming soon</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {gym.address.street}, {gym.address.area}, {gym.address.city}
                </p>
                <Button
                  className="mt-4"
                  fullWidth
                  beforeIcon={
                    <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                  }
                >
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
