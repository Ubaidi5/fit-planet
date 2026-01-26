"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  mockCheckIns,
  getCheckInsByMonth,
  getTotalDuration,
  formatDuration,
  getUniqueGyms,
  getStreakDays,
  type CheckIn,
} from "@/lib/data/mock-checkins";

type ViewType = "list" | "calendar";

export default function CheckInHistoryPage() {
  const [view, setView] = useState<ViewType>("list");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedGym, setSelectedGym] = useState<string>("all");

  const filteredCheckIns = useMemo(() => {
    let filtered = mockCheckIns;
    if (selectedGym !== "all") {
      filtered = filtered.filter((c) => c.gymId === selectedGym);
    }
    return filtered.sort(
      (a, b) =>
        new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime(),
    );
  }, [selectedGym]);

  const monthlyCheckIns = useMemo(() => {
    return getCheckInsByMonth(
      filteredCheckIns,
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
    );
  }, [filteredCheckIns, selectedMonth]);

  const stats = useMemo(() => {
    return {
      totalCheckIns: filteredCheckIns.length,
      totalDuration: getTotalDuration(filteredCheckIns),
      gymsVisited: getUniqueGyms(filteredCheckIns).length,
      streak: getStreakDays(mockCheckIns),
    };
  }, [filteredCheckIns]);

  const uniqueGyms = useMemo(() => {
    const gyms = new Map<string, { id: string; name: string }>();
    mockCheckIns.forEach((c) => {
      if (!gyms.has(c.gymId)) {
        gyms.set(c.gymId, { id: c.gymId, name: c.gymName });
      }
    });
    return Array.from(gyms.values());
  }, []);

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedMonth(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Check-in History
              </h1>
              <p className="text-gray-600 mt-1">
                Track all your gym visits and workout sessions
              </p>
            </div>
            <Link href="/app/dashboard">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {stats.totalCheckIns}
                  </p>
                  <p className="text-sm text-emerald-600">Total Check-ins</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatDuration(stats.totalDuration)}
                  </p>
                  <p className="text-sm text-blue-600">Total Time</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.gymsVisited}
                  </p>
                  <p className="text-sm text-purple-600">Gyms Visited</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">
                    {stats.streak}
                  </p>
                  <p className="text-sm text-orange-600">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & View Toggle */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Gyms</option>
                {uniqueGyms.map((gym) => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  view === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  view === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <svg
                  className="w-4 h-4 inline mr-2"
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
                Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "list" ? (
          <div className="space-y-4">
            {filteredCheckIns.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No check-ins yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Book a pass and visit a gym to see your check-in history
                </p>
                <Link href="/gyms">
                  <Button>Find Gyms Near You</Button>
                </Link>
              </div>
            ) : (
              filteredCheckIns.map((checkIn) => (
                <CheckInCard key={checkIn.id} checkIn={checkIn} />
              ))
            )}
          </div>
        ) : (
          <CalendarView
            checkIns={filteredCheckIns}
            selectedMonth={selectedMonth}
            onChangeMonth={changeMonth}
            monthlyCheckIns={monthlyCheckIns}
          />
        )}
      </div>
    </div>
  );
}

function CheckInCard({ checkIn }: { checkIn: CheckIn }) {
  const checkInDate = new Date(checkIn.checkInTime);
  const checkOutDate = checkIn.checkOutTime
    ? new Date(checkIn.checkOutTime)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Gym Logo */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
          {checkIn.gymLogo ? (
            <Image
              src={checkIn.gymLogo}
              alt={checkIn.gymName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              {checkIn.gymName.charAt(0)}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{checkIn.gymName}</h3>
              <p className="text-sm text-gray-500">{checkIn.gymAddress}</p>
            </div>
            <Badge variant="default" size="sm">
              {checkIn.passType} pass
            </Badge>
          </div>

          <div className="flex items-center gap-6 mt-2 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {checkInDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600">
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              {checkInDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>

            {checkOutDate && (
              <div className="flex items-center gap-1.5 text-red-500">
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {checkOutDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            )}

            {checkIn.duration && (
              <div className="flex items-center gap-1.5 text-gray-600">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDuration(checkIn.duration)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarView({
  checkIns,
  selectedMonth,
  onChangeMonth,
  monthlyCheckIns,
}: {
  checkIns: CheckIn[];
  selectedMonth: Date;
  onChangeMonth: (delta: number) => void;
  monthlyCheckIns: CheckIn[];
}) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get check-in dates for this month
  const checkInDates = new Set(
    monthlyCheckIns.map((c) => new Date(c.checkInTime).getDate()),
  );

  const days = [];
  // Add empty cells for days before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => onChangeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => onChangeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }

            const hasCheckIn = checkInDates.has(day);
            const isToday = isCurrentMonth && today.getDate() === day;

            return (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center relative",
                  hasCheckIn
                    ? "bg-emerald-100 text-emerald-700"
                    : "hover:bg-gray-50",
                  isToday && "ring-2 ring-emerald-500",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    hasCheckIn ? "text-emerald-700" : "text-gray-900",
                  )}
                >
                  {day}
                </span>
                {hasCheckIn && (
                  <span className="text-xs text-emerald-600">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Month Summary */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {monthlyCheckIns.length} check-ins this month
          </span>
          <span className="text-gray-600">
            Total time: {formatDuration(getTotalDuration(monthlyCheckIns))}
          </span>
        </div>
      </div>
    </div>
  );
}
