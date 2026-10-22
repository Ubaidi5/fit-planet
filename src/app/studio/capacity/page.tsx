"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import CapacitySettings from "@/components/studio/CapacitySettings";
import RealTimeMonitor from "@/components/studio/RealTimeMonitor";
import SlotAllocation from "@/components/studio/SlotAllocation";
import CapacityAnalytics from "@/components/studio/CapacityAnalytics";

type TabType = "settings" | "monitor" | "slots" | "analytics";

export default function StudioCapacityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("monitor");

  const tabs = [
    { id: "monitor" as TabType, label: "Real-Time Monitor", icon: "📊" },
    { id: "settings" as TabType, label: "Capacity Settings", icon: "⚙️" },
    { id: "slots" as TabType, label: "Slot Allocation", icon: "📅" },
    { id: "analytics" as TabType, label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Capacity Management
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor real-time occupancy, manage capacity limits, and analyze
            usage patterns
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-semibold text-emerald-600 tracking-tight">42</p>
                <p className="mt-1 text-sm text-gray-600">Current Occupancy</p>
                <p className="text-xs text-gray-500">out of 100</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-semibold text-blue-600 tracking-tight">100</p>
                <p className="mt-1 text-sm text-gray-600">Max Capacity</p>
                <p className="text-xs text-gray-500">total slots</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-semibold text-orange-600 tracking-tight">85%</p>
                <p className="mt-1 text-sm text-gray-600">Peak Utilization</p>
                <p className="text-xs text-gray-500">6-8 PM</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-semibold text-purple-600 tracking-tight">58</p>
                <p className="mt-1 text-sm text-gray-600">Avg. Daily</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-2 overflow-x-auto border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-emerald-500 bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-3xl bg-surface shadow-soft">
          {activeTab === "monitor" && <RealTimeMonitor />}
          {activeTab === "settings" && <CapacitySettings />}
          {activeTab === "slots" && <SlotAllocation />}
          {activeTab === "analytics" && <CapacityAnalytics />}
        </div>
      </div>
    </div>
  );
}
