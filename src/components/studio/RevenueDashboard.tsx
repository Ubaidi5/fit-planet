"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  // Revenue data by pass type
  const revenueByPassType = [
    { type: "Day Pass", amount: 142000, count: 89, percentage: 29.3 },
    { type: "Week Pass", amount: 168000, count: 42, percentage: 34.6 },
    { type: "Month Pass", amount: 145000, count: 29, percentage: 29.9 },
    { type: "Year Pass", amount: 30000, count: 2, percentage: 6.2 },
  ];

  // Monthly revenue trend (last 6 months)
  const monthlyTrends = [
    { month: "Aug", revenue: 385000 },
    { month: "Sep", revenue: 412000 },
    { month: "Oct", revenue: 445000 },
    { month: "Nov", revenue: 438000 },
    { month: "Dec", revenue: 475000 },
    { month: "Jan", revenue: 485000 },
  ];

  // Daily breakdown (last 7 days)
  const dailyBreakdown = [
    { day: "Mon", revenue: 58000 },
    { day: "Tue", revenue: 62000 },
    { day: "Wed", revenue: 71000 },
    { day: "Thu", revenue: 68000 },
    { day: "Fri", revenue: 82000 },
    { day: "Sat", revenue: 95000 },
    { day: "Sun", revenue: 89000 },
  ];

  const maxRevenue = Math.max(...monthlyTrends.map((t) => t.revenue));
  const totalRevenue = revenueByPassType.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setTimeRange("daily")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "daily"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange("weekly")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "weekly"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "monthly"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange("yearly")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "yearly"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">This Month</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            Rs. {(485000 / 1000).toFixed(0)}K
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            ↑ Rs. 10K vs last month
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Average Daily</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            Rs. {(485000 / 27).toFixed(0)}K
          </p>
          <p className="mt-1 text-xs text-gray-600">Based on 27 days</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Projected (Year)</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Rs. {((485000 * 12) / 1000000).toFixed(1)}M
          </p>
          <p className="mt-1 text-xs text-gray-600">At current rate</p>
        </div>
      </div>

      {/* Revenue Trends Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Revenue Trends
        </h3>

        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute bottom-0 left-0 top-0 flex w-16 flex-col justify-between text-xs text-gray-600">
            <span>Rs. {(maxRevenue / 1000).toFixed(0)}K</span>
            <span>Rs. {((maxRevenue * 0.75) / 1000).toFixed(0)}K</span>
            <span>Rs. {((maxRevenue * 0.5) / 1000).toFixed(0)}K</span>
            <span>Rs. {((maxRevenue * 0.25) / 1000).toFixed(0)}K</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-16 h-full">
            <div className="flex h-full items-end justify-between space-x-2 border-b border-l border-gray-300 pb-8 pl-4 pr-4">
              {monthlyTrends.map((trend, index) => {
                const height = (trend.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
                    {/* Bar */}
                    <div className="relative w-full">
                      <div
                        className="w-full rounded-t-lg bg-emerald-500 transition-all hover:bg-emerald-600"
                        style={{ height: `${height * 2}px` }}
                      />
                      {/* Value label */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-900">
                        Rs. {(trend.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                    {/* Month label */}
                    <span className="mt-2 text-xs text-gray-600">
                      {trend.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Pass Type */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Revenue by Pass Type
        </h3>

        <div className="space-y-4">
          {revenueByPassType.map((pass, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <span className="text-lg font-bold">
                      {pass.type.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{pass.type}</p>
                    <p className="text-xs text-gray-600">
                      {pass.count} bookings
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    Rs. {(pass.amount / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-600">
                    {pass.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative">
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${pass.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">
              Rs. {(totalRevenue / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </div>

      {/* Daily Breakdown (Last 7 Days) */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Daily Breakdown (Last 7 Days)
        </h3>

        <div className="flex items-end justify-between space-x-2">
          {dailyBreakdown.map((day, index) => {
            const maxDaily = Math.max(...dailyBreakdown.map((d) => d.revenue));
            const height = (day.revenue / maxDaily) * 100;

            return (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div className="mb-2 text-xs font-semibold text-gray-900">
                  Rs. {(day.revenue / 1000).toFixed(0)}K
                </div>
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    index === dailyBreakdown.length - 1 ||
                      index === dailyBreakdown.length - 2
                      ? "bg-emerald-500"
                      : "bg-blue-400",
                  )}
                  style={{ height: `${height * 1.5}px` }}
                />
                <span className="mt-2 text-xs font-medium text-gray-600">
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            💡 Weekend Performance
          </p>
          <p className="mt-1 text-xs text-blue-700">
            Weekend revenue (Sat-Sun) is 43% higher than weekdays. Consider
            offering weekday promotions to balance traffic.
          </p>
        </div>
      </div>
    </div>
  );
}
