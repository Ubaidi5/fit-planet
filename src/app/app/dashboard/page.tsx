"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineTicket,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineQrcode,
  HiOutlineShieldCheck,
} from "react-icons/hi";
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
  memberSince: "March 2024",
};

// Mock progress data
const mockProgress = {
  totalWorkouts: 156,
  favoriteGym: "FitZone Premium",
  totalSpent: 45000,
  personalRecords: [
    {
      exercise: "Bench Press",
      weight: 80,
      date: "2026-01-20",
      improvement: "+5kg",
    },
    {
      exercise: "Squat",
      weight: 120,
      date: "2026-01-15",
      improvement: "+10kg",
    },
    {
      exercise: "Deadlift",
      weight: 140,
      date: "2026-01-10",
      improvement: "+5kg",
    },
  ],
  weeklyWorkouts: [3, 4, 2, 5, 3, 4, 2], // Last 7 weeks
  monthlyHeatmap: generateHeatmapData(),
};

// Generate heatmap data for the last 30 days
function generateHeatmapData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Random workout count (0-3)
    const workouts =
      Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
    data.push({
      date: date.toISOString().split("T")[0],
      workouts,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return data;
}

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    type: "pass_expiry",
    message: "FitZone Premium pass expires in 3 days",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "friend",
    message: "Ali Hassan started following you",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    message: 'You earned the "30 Day Streak" badge! 🔥',
    time: "1 day ago",
    read: true,
  },
];

// Mock saved gyms
const mockSavedGyms = [
  {
    id: "1",
    name: "FitZone Premium",
    location: "Clifton, Karachi",
    rating: 4.8,
    image: null,
  },
  {
    id: "2",
    name: "Iron Paradise",
    location: "DHA Phase 5",
    rating: 4.6,
    image: null,
  },
];

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "progress">(
    "overview",
  );
  const activeBookings = getActiveBookings(mockBookings);
  const recentCheckIns = mockCheckIns.slice(0, 3);
  const streak = getStreakDays(mockCheckIns);
  const totalWorkoutTime = getTotalDuration(mockCheckIns);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-gray-600">{getGreeting()},</p>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl tracking-tight">
            {mockUser.fullName} 👋
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/app/notifications">
            <Button beforeIcon={<HiOutlineBell className="h-4 w-4" />}>
              Notifications
              <Badge variant="danger" size="sm" className="ms-2">
                2
              </Badge>
            </Button>
          </Link>
          <Link href="/gyms">
            <Button beforeIcon={<HiOutlineSearch className="h-4 w-4" />}>
              Find Gyms
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "overview"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "progress"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          Progress & Stats
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <HiOutlineTicket className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink tracking-tight">
                      {activeBookings.length}
                    </p>
                    <p className="text-xs text-gray-500">Active Passes</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <HiOutlineClipboardCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink tracking-tight">
                      {mockProgress.totalWorkouts}
                    </p>
                    <p className="text-xs text-gray-500">Total Workouts</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink tracking-tight">{streak}</p>
                    <p className="text-xs text-gray-500">Day Streak</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <HiOutlineClock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink tracking-tight">
                      {formatDuration(totalWorkoutTime)}
                    </p>
                    <p className="text-xs text-gray-500">Total Time</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Active Passes */}
            <Card>
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="font-semibold text-gray-900">Active Passes</h2>
                <Link
                  href="/app/passes"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View All →
                </Link>
              </div>

              {activeBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <HiOutlineTicket className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="mb-4 text-gray-600">No active passes</p>
                  <Link href="/gyms">
                    <Button size="sm">Book a Pass</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        {booking.gymLogo ? (
                          <Image
                            src={booking.gymLogo}
                            alt={booking.gymName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-100 font-bold text-emerald-600">
                            {booking.gymName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-gray-900">
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
            </Card>

            {/* Recent Check-ins */}
            <Card>
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="font-semibold text-gray-900">
                  Recent Check-ins
                </h2>
                <Link
                  href="/app/checkins"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
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
                        className="flex items-center gap-4 p-4"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          {checkIn.gymLogo ? (
                            <Image
                              src={checkIn.gymLogo}
                              alt={checkIn.gymName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-sm font-bold text-emerald-600">
                              {checkIn.gymName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
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
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Digital Identity Card */}
            <div className="rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 p-6 text-white">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
                  {mockUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{mockUser.fullName}</h3>
                  <p className="text-sm text-emerald-100">{mockUser.phone}</p>
                </div>
              </div>

              <div className="rounded-lg bg-white/10 p-4 text-center">
                <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-lg bg-white">
                  <HiOutlineQrcode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-emerald-100">
                  Your digital identity for gym access
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
                <HiOutlineShieldCheck className="h-4 w-4" />
                Phone Verified
              </div>
            </div>

            {/* Recent Notifications */}
            <Card>
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="font-semibold text-gray-900">Notifications</h2>
                <Link
                  href="/app/notifications"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {mockNotifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex gap-3 p-4",
                      !notif.read && "bg-emerald-50/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
                        notif.type === "pass_expiry"
                          ? "bg-amber-100"
                          : notif.type === "friend"
                            ? "bg-blue-100"
                            : "bg-emerald-100",
                      )}
                    >
                      {notif.type === "pass_expiry" && "⏰"}
                      {notif.type === "friend" && "👤"}
                      {notif.type === "achievement" && "🏆"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Saved Gyms */}
            <Card>
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="font-semibold text-gray-900">Saved Gyms</h2>
                <Link
                  href="/app/saved-gyms"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {mockSavedGyms.map((gym) => (
                  <Link
                    key={gym.id}
                    href={`/gyms/${gym.id}`}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-600">
                      {gym.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {gym.name}
                      </p>
                      <p className="text-xs text-gray-500">{gym.location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <span>⭐</span>
                      {gym.rating}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Streak Motivation */}
            {streak > 0 && (
              <Card className="border-orange-200 bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-3">
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
                        "h-2 flex-1 rounded-full",
                        i < streak % 7 ? "bg-orange-400" : "bg-orange-200",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-orange-600">
                  {7 - (streak % 7)} more days to complete this week!
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "progress" && (
        <div className="space-y-6">
          {/* Progress Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                  💪
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink tracking-tight">
                    {mockProgress.totalWorkouts}
                  </p>
                  <p className="text-sm text-gray-500">Total Workouts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  🏋️
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-gray-900">
                    {mockProgress.favoriteGym}
                  </p>
                  <p className="text-sm text-gray-500">Favorite Gym</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  💰
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink tracking-tight">
                    Rs. {mockProgress.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                  🔥
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink tracking-tight">{streak}</p>
                  <p className="text-sm text-gray-500">Current Streak</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Workout Calendar Heatmap */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Workout Calendar (Last 30 Days)
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
                {/* Empty cells for alignment */}
                {Array.from({
                  length: new Date(
                    mockProgress.monthlyHeatmap[0]?.date,
                  ).getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {mockProgress.monthlyHeatmap.map((day, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-sm transition-colors",
                      day.workouts === 0
                        ? "bg-gray-100"
                        : day.workouts === 1
                          ? "bg-emerald-200"
                          : day.workouts === 2
                            ? "bg-emerald-400"
                            : "bg-emerald-600",
                    )}
                    title={`${day.date}: ${day.workouts} workout${day.workouts !== 1 ? "s" : ""}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-gray-100" />
                  <div className="h-3 w-3 rounded-sm bg-emerald-200" />
                  <div className="h-3 w-3 rounded-sm bg-emerald-400" />
                  <div className="h-3 w-3 rounded-sm bg-emerald-600" />
                </div>
                <span>More</span>
              </div>
            </Card>

            {/* Weekly Workouts Chart */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Weekly Workouts (Last 7 Weeks)
              </h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {mockProgress.weeklyWorkouts.map((count, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-md bg-linear-to-t from-emerald-500 to-teal-400 transition-all"
                      style={{
                        height: `${(count / Math.max(...mockProgress.weeklyWorkouts)) * 100}%`,
                        minHeight: count > 0 ? "20px" : "4px",
                      }}
                    />
                    <span className="text-xs text-gray-500">W{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Average:{" "}
                {(
                  mockProgress.weeklyWorkouts.reduce((a, b) => a + b, 0) /
                  mockProgress.weeklyWorkouts.length
                ).toFixed(1)}{" "}
                workouts/week
              </p>
            </Card>
          </div>

          {/* Personal Records */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              🏆 Personal Records
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {mockProgress.personalRecords.map((pr, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{pr.exercise}</h4>
                    <Badge variant="success" size="sm">
                      {pr.improvement}
                    </Badge>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-emerald-600 tracking-tight">
                    {pr.weight} kg
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Achieved on{" "}
                    {new Date(pr.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Workout Consistency */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              📊 Consistency Stats
            </h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-4xl font-semibold text-emerald-600 tracking-tight">87%</p>
                <p className="mt-1 text-sm text-gray-500">
                  Monthly Consistency
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-semibold text-blue-600 tracking-tight">4.2</p>
                <p className="mt-1 text-sm text-gray-500">Avg. Workouts/Week</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-semibold text-purple-600 tracking-tight">62 min</p>
                <p className="mt-1 text-sm text-gray-500">
                  Avg. Workout Duration
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
