"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RatingAnalytics() {
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

  // Rating distribution data
  const ratingDistribution = [
    { stars: 5, count: 142, percentage: 57.3 },
    { stars: 4, count: 68, percentage: 27.4 },
    { stars: 3, count: 24, percentage: 9.7 },
    { stars: 2, count: 10, percentage: 4.0 },
    { stars: 1, count: 4, percentage: 1.6 },
  ];

  // Category ratings
  const categoryRatings = [
    { name: "Cleanliness", rating: 4.8, reviews: 235, change: "+0.2" },
    { name: "Equipment Quality", rating: 4.6, reviews: 248, change: "-0.1" },
    { name: "Staff Friendliness", rating: 4.9, reviews: 221, change: "+0.3" },
    { name: "Value for Money", rating: 4.5, reviews: 198, change: "+0.1" },
  ];

  // Rating trends (last 6 months)
  const ratingTrends = [
    { month: "Aug", rating: 4.5 },
    { month: "Sep", rating: 4.6 },
    { month: "Oct", rating: 4.6 },
    { month: "Nov", rating: 4.7 },
    { month: "Dec", rating: 4.7 },
    { month: "Jan", rating: 4.7 },
  ];

  // Competitor comparison (optional feature)
  const competitorData = [
    { name: "Your Gym", rating: 4.7, reviews: 248, highlight: true },
    { name: "FitZone Gym", rating: 4.5, reviews: 312 },
    { name: "PowerHouse", rating: 4.3, reviews: 189 },
    { name: "Elite Fitness", rating: 4.6, reviews: 276 },
  ];

  const maxRating = 5;
  const maxCount = Math.max(...ratingDistribution.map((r) => r.count));

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
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
          <button
            onClick={() => setTimeRange("year")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              timeRange === "year"
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            Year
          </button>
        </div>
      </div>

      {/* Overall Rating Summary */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Overall Rating Overview
        </h3>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Rating Score */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900">4.7</div>
              <div className="mt-2 flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-2xl text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">Based on 248 reviews</p>
              <p className="mt-1 text-xs text-emerald-600">
                ↑ 0.1 points vs last month
              </p>
            </div>
          </div>

          {/* Right: Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3">
                <div className="flex w-20 items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {item.stars}
                  </span>
                  <span className="text-yellow-400">⭐</span>
                </div>

                <div className="relative flex-1">
                  <div className="h-6 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex w-24 items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-gray-600">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Trends Chart */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Rating Trends
        </h3>

        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute bottom-0 left-0 top-0 flex w-12 flex-col justify-between text-xs text-gray-600">
            <span>5.0</span>
            <span>4.5</span>
            <span>4.0</span>
            <span>3.5</span>
            <span>3.0</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full">
            <div className="relative h-full border-b border-l border-gray-300">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-200"
                  style={{ top: `${i * 25}%` }}
                />
              ))}

              {/* Line chart */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 600 240"
              >
                {/* Line */}
                <polyline
                  points={ratingTrends
                    .map((trend, index) => {
                      const x = (index / (ratingTrends.length - 1)) * 580 + 10;
                      const y = 240 - ((trend.rating - 3) / 2) * 240;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="rgb(16, 185, 129)"
                  strokeWidth="3"
                />

                {/* Data points */}
                {ratingTrends.map((trend, index) => {
                  const x = (index / (ratingTrends.length - 1)) * 580 + 10;
                  const y = 240 - ((trend.rating - 3) / 2) * 240;
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="rgb(16, 185, 129)"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-xs font-semibold"
                        fill="rgb(16, 185, 129)"
                      >
                        {trend.rating}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 flex w-full justify-between px-2 text-xs text-gray-600">
                {ratingTrends.map((trend, index) => (
                  <span key={index}>{trend.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Rating by Category
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categoryRatings.map((category, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{category.name}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {category.reviews} reviews
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-emerald-600 tracking-tight">
                    {category.rating}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-semibold",
                      category.change.startsWith("+")
                        ? "text-emerald-600"
                        : "text-red-600",
                    )}
                  >
                    {category.change}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(category.rating / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="mt-2 flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(category.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Comparison (Optional) */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Competitor Comparison
          </h3>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {competitorData.map((gym, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg border p-4",
                gym.highlight
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-white",
                      gym.highlight ? "bg-emerald-600" : "bg-gray-400",
                    )}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>

                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        gym.highlight ? "text-emerald-900" : "text-gray-900",
                      )}
                    >
                      {gym.name}
                      {gym.highlight && (
                        <span className="ml-2 text-xs">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      {gym.reviews} reviews
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-semibold text-ink tracking-tight">
                    {gym.rating}
                  </span>
                  <span className="text-yellow-400">⭐</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          💡 Insights & Recommendations
        </h3>

        <div className="space-y-3">
          <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-900">
              🎉 Excellent Staff Rating
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Your staff friendliness rating (4.9) is your highest category.
              Consider featuring staff testimonials in marketing.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              📈 Rating Trending Up
            </p>
            <p className="mt-1 text-xs text-blue-700">
              Overall rating increased by 0.1 points this month. Keep up the
              great work!
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-900">
              ⚠️ Equipment Maintenance
            </p>
            <p className="mt-1 text-xs text-orange-700">
              Equipment quality rating dropped 0.1 points. Review recent
              negative feedback and address maintenance issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
