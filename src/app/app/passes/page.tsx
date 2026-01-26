"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  mockBookings,
  getActiveBookings,
  getUpcomingBookings,
  getPastBookings,
  formatPassType,
  type Booking,
} from "@/lib/data/mock-bookings";

type TabType = "active" | "upcoming" | "past";

export default function MyPassesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const activeBookings = getActiveBookings(mockBookings);
  const upcomingBookings = getUpcomingBookings(mockBookings);
  const pastBookings = getPastBookings(mockBookings);

  const currentBookings =
    activeTab === "active"
      ? activeBookings
      : activeTab === "upcoming"
        ? upcomingBookings
        : pastBookings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Passes</h1>
              <p className="text-gray-600 mt-1">
                Manage all your gym passes in one place
              </p>
            </div>
            <Link href="/gyms">
              <Button>
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Book New Pass
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("active")}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === "active"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              Active ({activeBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === "upcoming"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === "past"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              Past ({pastBookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentBookings.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentBookings.map((booking) => (
              <PassCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PassCard({ booking }: { booking: Booking }) {
  const [showQR, setShowQR] = useState(false);

  const getStatusBadge = () => {
    switch (booking.status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "upcoming":
        return <Badge variant="info">Upcoming</Badge>;
      case "expired":
        return <Badge variant="default">Expired</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(booking.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {booking.gymLogo ? (
              <Image
                src={booking.gymLogo}
                alt={booking.gymName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">
                {booking.gymName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {booking.gymName}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatPassType(booking.passType)}
                </p>
              </div>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Valid From</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(booking.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Valid Until</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(booking.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Days Remaining (Active only) */}
        {booking.status === "active" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-700">Days Remaining</span>
              <span className="text-lg font-bold text-emerald-700">
                {getDaysRemaining()}
              </span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-gray-500">Check-ins</p>
            <p className="font-semibold text-gray-900">
              {booking.totalCheckIns}
            </p>
          </div>
          {booking.lastCheckIn && (
            <div>
              <p className="text-gray-500">Last Visit</p>
              <p className="font-semibold text-gray-900">
                {new Date(booking.lastCheckIn).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Amount Paid</p>
            <p className="font-semibold text-gray-900">
              Rs. {booking.finalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Add-ons */}
        {booking.addOns && booking.addOns.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Add-ons</p>
            <div className="flex flex-wrap gap-2">
              {booking.addOns.map((addon, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {addon.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* QR Code Section */}
        {booking.status === "active" && (
          <div>
            {showQR ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <div className="inline-block bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="h-12 w-12 mx-auto text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">QR Code</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Booking ID: {booking.id}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Show this at gym entrance
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowQR(false)}
                >
                  Hide QR Code
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowQR(true)}
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                Show QR Code
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
        <Link href={`/gyms/${booking.gymId}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            View Gym
          </Button>
        </Link>
        {booking.status === "active" && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            Cancel Pass
          </Button>
        )}
        {(booking.status === "expired" || booking.status === "cancelled") && (
          <Button size="sm" className="flex-1">
            Book Again
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: TabType }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {tab === "active"
          ? "No Active Passes"
          : tab === "upcoming"
            ? "No Upcoming Passes"
            : "No Past Bookings"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {tab === "active"
          ? "You don't have any active gym passes. Book a pass to start your fitness journey!"
          : tab === "upcoming"
            ? "You don't have any upcoming passes scheduled."
            : "You haven't made any bookings yet."}
      </p>
      <Link href="/gyms">
        <Button>
          <svg
            className="h-5 w-5 mr-2"
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
          Find Gyms Near You
        </Button>
      </Link>
    </div>
  );
}
