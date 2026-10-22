"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CheckedInUser {
  id: string;
  name: string;
  passType: string;
  checkInTime: string;
  duration: number; // minutes since check-in
}

interface CapacityData {
  current: number;
  max: number;
  memberCount: number;
  dayPassCount: number;
  peakTime: boolean;
}

export default function RealTimeMonitor() {
  const [capacityData, setCapacityData] = useState<CapacityData>({
    current: 42,
    max: 100,
    memberCount: 30,
    dayPassCount: 12,
    peakTime: false,
  });

  const [checkedInUsers, setCheckedInUsers] = useState<CheckedInUser[]>([
    {
      id: "1",
      name: "Ahmed Khan",
      passType: "Monthly Member",
      checkInTime: "2026-01-27T08:30:00",
      duration: 45,
    },
    {
      id: "2",
      name: "Sara Ali",
      passType: "Day Pass",
      checkInTime: "2026-01-27T09:00:00",
      duration: 15,
    },
    {
      id: "3",
      name: "Hassan Raza",
      passType: "Monthly Member",
      checkInTime: "2026-01-27T08:00:00",
      duration: 75,
    },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate duration updates
      setCheckedInUsers((prev) =>
        prev.map((user) => ({
          ...user,
          duration: user.duration + 1,
        })),
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getUtilizationPercentage = () => {
    return Math.round((capacityData.current / capacityData.max) * 100);
  };

  const getUtilizationColor = () => {
    const percentage = getUtilizationPercentage();
    if (percentage >= 90) return "text-red-600 bg-red-100";
    if (percentage >= 75) return "text-orange-600 bg-orange-100";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-emerald-600 bg-emerald-100";
  };

  const getUtilizationStatus = () => {
    const percentage = getUtilizationPercentage();
    if (percentage >= 90) return "🔴 Near Capacity";
    if (percentage >= 75) return "🟠 High Usage";
    if (percentage >= 50) return "🟡 Moderate";
    return "🟢 Low Usage";
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Real-Time Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Capacity Gauge */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Current Occupancy
            </h3>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">Auto-refresh</span>
            </label>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="h-48 w-48 -rotate-90 transform">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - capacityData.current / capacityData.max)}`}
                  className={cn(
                    "transition-all duration-500",
                    getUtilizationPercentage() >= 90
                      ? "text-red-500"
                      : getUtilizationPercentage() >= 75
                        ? "text-orange-500"
                        : "text-emerald-500",
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-gray-900">
                  {capacityData.current}
                </p>
                <p className="text-sm text-gray-600">
                  of {capacityData.max} people
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-700">
                  {getUtilizationPercentage()}%
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 text-center">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
                getUtilizationColor(),
              )}
            >
              {getUtilizationStatus()}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {/* Member vs Day Pass */}
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              User Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Monthly Members
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {capacityData.memberCount}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${(capacityData.memberCount / capacityData.max) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Day Pass Users
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {capacityData.dayPassCount}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${(capacityData.dayPassCount / capacityData.max) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Available Slots
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-semibold text-ink tracking-tight">
                  {capacityData.max - capacityData.current}
                </p>
                <p className="text-sm text-gray-600">Total Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-semibold text-ink tracking-tight">5</p>
                <p className="text-sm text-gray-600">On Waitlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Check-Ins */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Currently Checked In
          </h3>
          <Button variant="outline" size="sm">
            Export List
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Pass Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Check-In Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Duration
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {checkedInUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                        user.passType === "Monthly Member"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800",
                      )}
                    >
                      {user.passType}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {formatTime(user.checkInTime)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDuration(user.duration)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                    <Button variant="outline" size="sm">
                      Check Out
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {checkedInUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600">No users currently checked in</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">Refresh Data</Button>
        <Button variant="danger">Emergency Close</Button>
      </div>
    </div>
  );
}
