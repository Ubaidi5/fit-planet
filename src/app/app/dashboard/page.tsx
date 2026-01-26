"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { mockBookings, getActiveBookings } from "@/lib/data/mock-bookings";
import {
  mockCheckIns,
  getStreakDays,
  formatDuration,
  getTotalDuration,
} from "@/lib/data/mock-checkins";

// Mock user data for dashboard
const mockUser = {
  fullName: "Muhammad Ali",
  phone: "+92 300 1234567",
  avatar: null,
};

export default function UserDashboardPage() {
  const activeBookings = getActiveBookings(mockBookings);
  const recentCheckIns = mockCheckIns.slice(0, 3);
  const streak = getStreakDays(mockCheckIns);
  const totalWorkoutTime = getTotalDuration(mockCheckIns);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Good morning,</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {mockUser.fullName} 👋
              </h1>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find Gyms
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
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
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {activeBookings.length}
                    </p>
                    <p className="text-xs text-gray-500">Active Passes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockCheckIns.length}
                    </p>
                    <p className="text-xs text-gray-500">Total Check-ins</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{streak}</p>
                    <p className="text-xs text-gray-500">Day Streak</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
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
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDuration(totalWorkoutTime)}
                    </p>
                    <p className="text-xs text-gray-500">Total Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Passes */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Active Passes</h2>
                <Link
                  href="/app/passes"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All →
                </Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
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
                  <p className="text-gray-600 mb-4">No active passes</p>
                  <Link href="/gyms">
                    <Button size="sm">Book a Pass</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        {booking.gymLogo ? (
                          <Image
                            src={booking.gymLogo}
                            alt={booking.gymName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                            {booking.gymName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {booking.gymName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.passType.charAt(0).toUpperCase() +
                            booking.passType.slice(1)}{" "}
                          Pass • Expires{" "}
                          {new Date(booking.endDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <Link href="/app/passes">
                        <Button variant="outline" size="sm">
                          Show QR
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Check-ins */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Recent Check-ins
                </h2>
                <Link
                  href="/app/checkins"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All →
                </Link>
              </div>

              {recentCheckIns.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No check-ins yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentCheckIns.map((checkIn) => {
                    const checkInDate = new Date(checkIn.checkInTime);
                    return (
                      <div
                        key={checkIn.id}
                        className="p-4 flex items-center gap-4"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          {checkIn.gymLogo ? (
                            <Image
                              src={checkIn.gymLogo}
                              alt={checkIn.gymName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                              {checkIn.gymName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {checkIn.gymName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {checkInDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {checkInDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {checkIn.duration && (
                          <span className="text-sm text-gray-500">
                            {formatDuration(checkIn.duration)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Digital Identity Card */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                  {mockUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{mockUser.fullName}</h3>
                  <p className="text-emerald-100 text-sm">{mockUser.phone}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
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
                </div>
                <p className="text-emerald-100 text-sm">
                  Your digital identity for gym access
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Phone Verified
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  href="/gyms"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
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
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Find Gyms
                    </p>
                    <p className="text-xs text-gray-500">
                      Discover gyms near you
                    </p>
                  </div>
                </Link>

                <Link
                  href="/app/passes"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Show QR</p>
                    <p className="text-xs text-gray-500">For gym check-in</p>
                  </div>
                </Link>

                <Link
                  href="/app/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
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
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Edit Profile
                    </p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Streak Motivation */}
            {streak > 0 && (
              <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-semibold text-orange-800">
                      {streak} Day Streak!
                    </p>
                    <p className="text-sm text-orange-600">Keep it going!</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 h-2 rounded-full",
                        i < streak % 7 ? "bg-orange-400" : "bg-orange-200",
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  {7 - (streak % 7)} more days to complete this week!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
