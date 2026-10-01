"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface HourlySlot {
  time: string;
  current: number;
  capacity: number;
  status: "low" | "moderate" | "high" | "full";
}

export default function CapacityOverview() {
  const currentCapacity = 42;
  const maxCapacity = 100;
  const utilizationPercentage = (currentCapacity / maxCapacity) * 100;

  const getUtilizationStatus = () => {
    if (utilizationPercentage >= 90)
      return { label: "Critical", color: "text-red-600" };
    if (utilizationPercentage >= 75)
      return { label: "High", color: "text-orange-600" };
    if (utilizationPercentage >= 50)
      return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Low", color: "text-emerald-600" };
  };

  const status = getUtilizationStatus();

  const upcomingSlots: HourlySlot[] = [
    { time: "11:00 AM", current: 42, capacity: 100, status: "moderate" },
    { time: "12:00 PM", current: 35, capacity: 100, status: "low" },
    { time: "01:00 PM", current: 38, capacity: 100, status: "low" },
    { time: "02:00 PM", current: 45, capacity: 100, status: "moderate" },
    { time: "03:00 PM", current: 52, capacity: 100, status: "moderate" },
    { time: "04:00 PM", current: 68, capacity: 100, status: "high" },
    { time: "05:00 PM", current: 82, capacity: 100, status: "high" },
    { time: "06:00 PM", current: 95, capacity: 100, status: "full" },
  ];

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "full":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Capacity Status
          </h3>
          <p className="mt-1 text-sm text-gray-600">Current gym occupancy</p>
        </div>
        <Link
          href="/studio/capacity"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Manage →
        </Link>
      </div>

      {/* Current Capacity Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-3xl font-semibold text-ink tracking-tight">
              {currentCapacity}/{maxCapacity}
            </p>
            <p className="text-sm text-gray-600">People currently inside</p>
          </div>
          <div className={cn("text-right", status.color)}>
            <p className="text-lg font-bold">
              {Math.round(utilizationPercentage)}%
            </p>
            <p className="text-xs font-semibold">{status.label}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full transition-all duration-500",
              utilizationPercentage >= 90
                ? "bg-red-500"
                : utilizationPercentage >= 75
                  ? "bg-orange-500"
                  : utilizationPercentage >= 50
                    ? "bg-yellow-500"
                    : "bg-emerald-500",
            )}
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-700">Members</p>
          <p className="mt-1 text-xl font-bold text-blue-900">28</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3">
          <p className="text-xs font-medium text-purple-700">Day Passes</p>
          <p className="mt-1 text-xl font-bold text-purple-900">14</p>
        </div>
      </div>

      {/* Upcoming Hour Forecast */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          Upcoming Hours Forecast
        </h4>
        <div className="space-y-2">
          {upcomingSlots.slice(0, 5).map((slot, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="w-16 text-xs font-medium text-gray-700">
                {slot.time}
              </span>
              <div className="relative flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full transition-all",
                      getSlotStatusColor(slot.status),
                    )}
                    style={{
                      width: `${(slot.current / slot.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className="w-8 text-xs text-gray-600">{slot.current}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-200 pt-4">
        <div className="flex items-center space-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-700">Low</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-700">Moderate</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-700">High</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-xs text-gray-700">Full</span>
        </div>
      </div>
    </div>
  );
}
