"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HourlyData {
  hour: string;
  avgOccupancy: number;
  peakDay: string;
}

interface DailyTrend {
  date: string;
  avgOccupancy: number;
  peakOccupancy: number;
  totalVisits: number;
}

interface Recommendation {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  action?: string;
}

export default function CapacityAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "week",
  );

  const hourlyData: HourlyData[] = [
    { hour: "06:00", avgOccupancy: 45, peakDay: "Monday" },
    { hour: "07:00", avgOccupancy: 62, peakDay: "Tuesday" },
    { hour: "08:00", avgOccupancy: 78, peakDay: "Monday" },
    { hour: "09:00", avgOccupancy: 55, peakDay: "Wednesday" },
    { hour: "10:00", avgOccupancy: 42, peakDay: "Thursday" },
    { hour: "11:00", avgOccupancy: 38, peakDay: "Friday" },
    { hour: "12:00", avgOccupancy: 35, peakDay: "Tuesday" },
    { hour: "13:00", avgOccupancy: 40, peakDay: "Monday" },
    { hour: "14:00", avgOccupancy: 48, peakDay: "Wednesday" },
    { hour: "15:00", avgOccupancy: 52, peakDay: "Thursday" },
    { hour: "16:00", avgOccupancy: 65, peakDay: "Monday" },
    { hour: "17:00", avgOccupancy: 82, peakDay: "Tuesday" },
    { hour: "18:00", avgOccupancy: 95, peakDay: "Monday" },
    { hour: "19:00", avgOccupancy: 88, peakDay: "Wednesday" },
    { hour: "20:00", avgOccupancy: 72, peakDay: "Thursday" },
    { hour: "21:00", avgOccupancy: 48, peakDay: "Friday" },
    { hour: "22:00", avgOccupancy: 28, peakDay: "Saturday" },
  ];

  const dailyTrends: DailyTrend[] = [
    {
      date: "Mon",
      avgOccupancy: 68,
      peakOccupancy: 95,
      totalVisits: 245,
    },
    {
      date: "Tue",
      avgOccupancy: 72,
      peakOccupancy: 92,
      totalVisits: 268,
    },
    {
      date: "Wed",
      avgOccupancy: 65,
      peakOccupancy: 88,
      totalVisits: 232,
    },
    {
      date: "Thu",
      avgOccupancy: 70,
      peakOccupancy: 90,
      totalVisits: 255,
    },
    {
      date: "Fri",
      avgOccupancy: 75,
      peakOccupancy: 98,
      totalVisits: 289,
    },
    {
      date: "Sat",
      avgOccupancy: 82,
      peakOccupancy: 100,
      totalVisits: 312,
    },
    {
      date: "Sun",
      avgOccupancy: 78,
      peakOccupancy: 96,
      totalVisits: 295,
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: "1",
      type: "warning",
      title: "Peak Hour Congestion",
      description:
        "6:00 PM - 8:00 PM consistently reaches 90%+ capacity. Consider implementing time-slot booking.",
      action: "Enable slot reservations",
    },
    {
      id: "2",
      type: "info",
      title: "Low Utilization Period",
      description:
        "11:00 AM - 2:00 PM has only 35-40% average occupancy. Offer discounted day passes during this time.",
      action: "Create off-peak discount",
    },
    {
      id: "3",
      type: "success",
      title: "Optimal Capacity Balance",
      description:
        "Early morning hours (6-9 AM) maintain healthy 45-78% utilization with good member satisfaction.",
    },
    {
      id: "4",
      type: "warning",
      title: "Weekend Overcrowding",
      description:
        "Saturdays reach 100% capacity multiple times. Consider increasing capacity or limiting day passes.",
      action: "Adjust weekend limits",
    },
  ];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "💡";
      default:
        return "ℹ️";
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-orange-200 bg-orange-50";
      case "success":
        return "border-emerald-200 bg-emerald-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const maxOccupancy = Math.max(...hourlyData.map((d) => d.avgOccupancy));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Capacity Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Historical trends and optimization insights
          </p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 p-1">
          <button
            onClick={() => setTimeRange("week")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
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
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "month"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("quarter")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "quarter"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm text-gray-600">Avg Occupancy</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">68%</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 5% vs last week</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm text-gray-600">Peak Hours</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">6-8 PM</p>
          <p className="mt-1 text-xs text-gray-600">95% avg capacity</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm text-gray-600">Total Visits</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">1,896</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 12% vs last week</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm text-gray-600">Busiest Day</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">Sat</p>
          <p className="mt-1 text-xs text-gray-600">312 visits</p>
        </div>
      </div>

      {/* Hourly Utilization Chart */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Average Hourly Utilization
        </h3>
        <div className="space-y-2">
          {hourlyData.map((data) => (
            <div key={data.hour} className="flex items-center space-x-4">
              <span className="w-16 text-sm font-medium text-gray-700">
                {data.hour}
              </span>
              <div className="relative flex-1">
                <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                  <div
                    className={cn(
                      "flex h-full items-center rounded-lg px-3 text-xs font-semibold text-white transition-all",
                      data.avgOccupancy >= 80
                        ? "bg-red-500"
                        : data.avgOccupancy >= 60
                          ? "bg-orange-500"
                          : data.avgOccupancy >= 40
                            ? "bg-emerald-500"
                            : "bg-blue-500",
                    )}
                    style={{
                      width: `${(data.avgOccupancy / maxOccupancy) * 100}%`,
                    }}
                  >
                    {data.avgOccupancy}%
                  </div>
                </div>
              </div>
              <span className="w-24 text-xs text-gray-600">
                Peak: {data.peakDay}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-6 border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-xs text-gray-700">Low (&lt;40%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-emerald-500" />
            <span className="text-xs text-gray-700">Moderate (40-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span className="text-xs text-gray-700">High (60-80%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-xs text-gray-700">Critical (80%+)</span>
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Weekly Trends
        </h3>
        <div className="grid grid-cols-7 gap-3">
          {dailyTrends.map((day) => (
            <div
              key={day.date}
              className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4 text-center"
            >
              <p className="text-sm font-semibold text-gray-900">{day.date}</p>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-ink tracking-tight">
                  {day.avgOccupancy}%
                </p>
                <p className="text-xs text-gray-600">Avg</p>
              </div>
              <div className="mt-3 border-t border-gray-200 pt-3">
                <p className="text-sm font-semibold text-red-600">
                  {day.peakOccupancy}%
                </p>
                <p className="text-xs text-gray-600">Peak</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {day.totalVisits} visits
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={cn(
                "rounded-lg border-2 p-4",
                getRecommendationColor(rec.type),
              )}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">
                  {getRecommendationIcon(rec.type)}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <p className="mt-1 text-sm text-gray-700">
                    {rec.description}
                  </p>
                  {rec.action && (
                    <Button variant="outline" size="sm" className="mt-3">
                      {rec.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">📊 Export Report</Button>
        <Button variant="outline">📧 Email Report</Button>
      </div>
    </div>
  );
}
