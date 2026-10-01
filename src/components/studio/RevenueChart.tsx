"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const weekData: RevenueData[] = [
    { date: "Mon", revenue: 18500, bookings: 32 },
    { date: "Tue", revenue: 22000, bookings: 38 },
    { date: "Wed", revenue: 19500, bookings: 35 },
    { date: "Thu", revenue: 24000, bookings: 42 },
    { date: "Fri", revenue: 28500, bookings: 48 },
    { date: "Sat", revenue: 35000, bookings: 58 },
    { date: "Sun", revenue: 31000, bookings: 52 },
  ];

  const monthData: RevenueData[] = [
    { date: "Week 1", revenue: 88000, bookings: 145 },
    { date: "Week 2", revenue: 92000, bookings: 158 },
    { date: "Week 3", revenue: 85000, bookings: 142 },
    { date: "Week 4", revenue: 98000, bookings: 168 },
  ];

  const yearData: RevenueData[] = [
    { date: "Jan", revenue: 285000, bookings: 520 },
    { date: "Feb", revenue: 310000, bookings: 580 },
    { date: "Mar", revenue: 295000, bookings: 550 },
    { date: "Apr", revenue: 320000, bookings: 610 },
    { date: "May", revenue: 342000, bookings: 640 },
    { date: "Jun", revenue: 355000, bookings: 670 },
    { date: "Jul", revenue: 370000, bookings: 690 },
    { date: "Aug", revenue: 365000, bookings: 680 },
    { date: "Sep", revenue: 348000, bookings: 650 },
    { date: "Oct", revenue: 360000, bookings: 670 },
    { date: "Nov", revenue: 378000, bookings: 700 },
    { date: "Dec", revenue: 390000, bookings: 720 },
  ];

  const getData = () => {
    switch (timeRange) {
      case "week":
        return weekData;
      case "month":
        return monthData;
      case "year":
        return yearData;
      default:
        return weekData;
    }
  };

  const data = getData();
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = data.reduce((sum, d) => sum + d.bookings, 0);

  return (
    <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Track your earnings and bookings
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setTimeRange("week")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              timeRange === "week"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              timeRange === "month"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              timeRange === "year"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-900 tracking-tight">
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Total Bookings</p>
          <p className="mt-1 text-2xl font-semibold text-blue-900 tracking-tight">
            {totalBookings}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-64 flex-col justify-between text-xs text-gray-500">
          <span>Rs. {Math.round(maxRevenue / 1000)}k</span>
          <span>Rs. {Math.round((maxRevenue * 0.75) / 1000)}k</span>
          <span>Rs. {Math.round((maxRevenue * 0.5) / 1000)}k</span>
          <span>Rs. {Math.round((maxRevenue * 0.25) / 1000)}k</span>
          <span>Rs. 0</span>
        </div>

        {/* Chart area */}
        <div className="ms-12 flex h-64 items-end space-x-2">
          {data.map((item, index) => {
            const heightPercentage = (item.revenue / maxRevenue) * 100;

            return (
              <div key={index} className="group relative flex-1">
                {/* Tooltip */}
                <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-2 text-xs text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <p className="font-semibold">
                    Rs. {item.revenue.toLocaleString()}
                  </p>
                  <p className="text-gray-300">{item.bookings} bookings</p>
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>

                {/* Bar */}
                <div
                  className="w-full cursor-pointer rounded-t-lg bg-linear-to-t from-emerald-500 to-emerald-400 transition-all hover:from-emerald-600 hover:to-emerald-500"
                  style={{ height: `${heightPercentage}%` }}
                />

                {/* X-axis label */}
                <p className="mt-2 text-center text-xs font-medium text-gray-600">
                  {item.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid lines */}
      <div className="ms-12 mt-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
