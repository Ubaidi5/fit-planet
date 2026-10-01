"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  HiOutlinePlus,
  HiOutlineQrcode,
  HiOutlineTicket,
  HiOutlineSearch,
} from "react-icons/hi";
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink tracking-tight">My Passes</h1>
              <p className="text-gray-600 mt-1">
                Manage all your gym passes in one place
              </p>
            </div>
            <Link href="/gyms">
              <Button beforeIcon={<HiOutlinePlus className="h-5 w-5" />}>
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
    <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden hover:shadow-lift transition-shadow shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
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
                      <HiOutlineQrcode className="h-12 w-12 mx-auto text-gray-400 mb-2" />
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
                fullWidth
                onClick={() => setShowQR(true)}
                beforeIcon={<HiOutlineQrcode className="h-5 w-5" />}
              >
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
        <HiOutlineTicket className="h-10 w-10 text-gray-400" />
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
          <HiOutlineSearch className="h-5 w-5 mr-2" />
          Find Gyms Near You
        </Button>
      </Link>
    </div>
  );
}
