"use client";

import { useState } from "react";
import PromotionalCampaigns from "@/components/studio/PromotionalCampaigns";
import ReferralProgram from "@/components/studio/ReferralProgram";
import NotificationCenter from "@/components/studio/NotificationCenter";
import CampaignAnalytics from "@/components/studio/CampaignAnalytics";
import { cn } from "@/lib/utils";

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "referrals" | "notifications" | "analytics"
  >("campaigns");

  const tabs = [
    { id: "campaigns", label: "Campaigns", icon: "🎉" },
    { id: "referrals", label: "Referrals", icon: "🤝" },
    { id: "notifications", label: "Notifications", icon: "📢" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Promotions & Marketing
        </h1>
        <p className="mt-2 text-gray-600">
          Create campaigns, manage referrals, and track performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 2 new this week</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Referrals</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">48</p>
          <p className="mt-1 text-xs text-gray-600">12 converted this month</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Campaign Revenue</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">Rs. 245K</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 18% vs last month</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">24.5%</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 3.2% increase</p>
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
        {activeTab === "campaigns" && <PromotionalCampaigns />}
        {activeTab === "referrals" && <ReferralProgram />}
        {activeTab === "notifications" && <NotificationCenter />}
        {activeTab === "analytics" && <CampaignAnalytics />}
      </div>
    </div>
  );
}
