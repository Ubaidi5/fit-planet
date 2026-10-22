"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CampaignPerformance {
  name: string;
  type: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export default function CampaignAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month",
  );

  const campaigns: CampaignPerformance[] = [
    {
      name: "New Year Fitness Challenge",
      type: "Seasonal",
      impressions: 12500,
      clicks: 3200,
      conversions: 45,
      revenue: 67500,
    },
    {
      name: "Weekend Flash Sale",
      type: "Flash Sale",
      impressions: 8900,
      clicks: 2150,
      conversions: 28,
      revenue: 42000,
    },
    {
      name: "Student Special",
      type: "Limited Time",
      impressions: 15200,
      clicks: 4100,
      conversions: 62,
      revenue: 93000,
    },
    {
      name: "Referral Program",
      type: "Ongoing",
      impressions: 5600,
      clicks: 1800,
      conversions: 12,
      revenue: 18000,
    },
  ];

  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const avgConversionRate = (totalConversions / totalClicks) * 100 || 0;

  const channelData = [
    {
      channel: "Push Notifications",
      reach: 8500,
      conversions: 85,
      revenue: 127500,
    },
    {
      channel: "Email Campaigns",
      reach: 6200,
      conversions: 62,
      revenue: 93000,
    },
    { channel: "SMS Marketing", reach: 3100, conversions: 28, revenue: 42000 },
    { channel: "Social Media", reach: 15000, conversions: 52, revenue: 78000 },
  ];

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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600 tracking-tight">
            Rs. {(totalRevenue / 1000).toFixed(1)}K
          </p>
          <p className="mt-1 text-xs text-emerald-600">↑ 18% vs last month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Conversions</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
            {totalConversions}
          </p>
          <p className="mt-1 text-xs text-emerald-600">↑ 12% increase</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">
            Click-Through Rate
          </p>
          <p className="mt-2 text-3xl font-semibold text-blue-600 tracking-tight">
            {((totalClicks / 42100) * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-gray-600">Campaign engagement</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
            {avgConversionRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-gray-600">Avg. across campaigns</p>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface shadow-soft">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Campaign Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-600">
                <th className="p-4">Campaign</th>
                <th className="p-4">Type</th>
                <th className="p-4">Impressions</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">CTR</th>
                <th className="p-4">Conversions</th>
                <th className="p-4">Conv. Rate</th>
                <th className="p-4">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((campaign, index) => {
                const ctr = (campaign.clicks / campaign.impressions) * 100;
                const convRate = (campaign.conversions / campaign.clicks) * 100;

                return (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {campaign.name}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {campaign.type}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {campaign.impressions.toLocaleString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {campaign.clicks.toLocaleString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-semibold text-blue-600">
                        {ctr.toFixed(1)}%
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {campaign.conversions}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-semibold text-emerald-600">
                        {convRate.toFixed(1)}%
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Rs. {(campaign.revenue / 1000).toFixed(1)}K
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Performance by Channel
        </h3>

        <div className="space-y-6">
          {channelData.map((channel, index) => {
            const conversionRate = (channel.conversions / channel.reach) * 100;
            const reachPercentage = (channel.reach / 32800) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {channel.channel.includes("Push")
                        ? "📱"
                        : channel.channel.includes("Email")
                          ? "📧"
                          : channel.channel.includes("SMS")
                            ? "💬"
                            : "🌐"}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {channel.channel}
                      </p>
                      <p className="text-xs text-gray-600">
                        {channel.reach.toLocaleString()} reach •{" "}
                        {channel.conversions} conversions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      Rs. {(channel.revenue / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-600">
                      {conversionRate.toFixed(1)}% conv. rate
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${reachPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Campaigns */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top Performing Campaigns
          </h3>

          <div className="space-y-3">
            {campaigns
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((campaign, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {campaign.conversions} conversions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-600">
                      Rs. {(campaign.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            💡 Recommendations
          </h3>

          <div className="space-y-3">
            <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                Increase Email Campaigns
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                Email has the highest conversion rate (1.51%). Consider doubling
                email frequency.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Optimize Push Notifications
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Push has good reach but lower conv. rate. Test different timing
                and messaging.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-900">
                Expand Social Media
              </p>
              <p className="mt-1 text-xs text-orange-700">
                Social has highest reach. Increase budget for better targeting
                and conversions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
