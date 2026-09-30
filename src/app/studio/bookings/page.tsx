"use client";

import { useState } from "react";
import CheckInSystem from "@/components/studio/CheckInSystem";
import ActiveMembers from "@/components/studio/ActiveMembers";
import BookingHistory from "@/components/studio/BookingHistory";
import MemberInsights from "@/components/studio/MemberInsights";
import { cn } from "@/lib/utils";

export default function MembersBookingsPage() {
  const [activeTab, setActiveTab] = useState<
    "checkin" | "active" | "bookings" | "insights"
  >("checkin");

  const tabs = [
    { id: "checkin", label: "Check-In", icon: "📱" },
    { id: "active", label: "Active Members", icon: "👥" },
    { id: "bookings", label: "Booking History", icon: "📋" },
    { id: "insights", label: "Member Insights", icon: "📊" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-ink tracking-tight">Members & Bookings</h1>
        <p className="mt-2 text-gray-600">
          Manage check-ins, track bookings, and analyze member activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Today's Check-ins</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">47</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 12% vs yesterday</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Currently Inside</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">42</p>
          <p className="mt-1 text-xs text-gray-600">28 members • 14 day pass</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">1,248</p>
          <p className="mt-1 text-xs text-gray-600">This month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Active Passes</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">128</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 8% vs last month</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex space-x-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900",
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "checkin" && <CheckInSystem />}
        {activeTab === "active" && <ActiveMembers />}
        {activeTab === "bookings" && <BookingHistory />}
        {activeTab === "insights" && <MemberInsights />}
      </div>
    </div>
  );
}
