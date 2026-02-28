"use client";

import RevenueChart from "@/components/studio/RevenueChart";
import RecentBookings from "@/components/studio/RecentBookings";
import QuickActions from "@/components/studio/QuickActions";
import CapacityOverview from "@/components/studio/CapacityOverview";
import {
  HiOutlineCheckCircle,
  HiOutlineTicket,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
} from "react-icons/hi";

export default function StudioDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your gym&apos;s performance and operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Check-ins */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today&apos;s Check-ins
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">47</p>
              <p className="mt-1 text-xs text-emerald-600">
                ↑ 12% vs yesterday
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <HiOutlineCheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Active Passes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Passes</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">128</p>
              <p className="mt-1 text-xs text-gray-600">
                85 monthly • 43 daily
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <HiOutlineTicket className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today&apos;s Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                Rs. 24,500
              </p>
              <p className="mt-1 text-xs text-emerald-600">↑ 8% vs yesterday</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <HiOutlineCurrencyDollar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Current Capacity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Capacity
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">42/100</p>
              <p className="mt-1 text-xs text-gray-600">42% utilization</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <HiOutlineUserGroup className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* Recent Bookings */}
          <RecentBookings />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Capacity Overview */}
          <CapacityOverview />
        </div>
      </div>
    </div>
  );
}
