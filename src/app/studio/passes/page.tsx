"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import PassTypeManager from "@/components/studio/PassTypeManager";
import DiscountsManager from "@/components/studio/DiscountsManager";
import AddOnsManager from "@/components/studio/AddOnsManager";

type TabType = "passes" | "discounts" | "addons";

export default function StudioPassesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("passes");

  const tabs = [
    { id: "passes" as TabType, label: "Pass Types & Pricing", icon: "🎫" },
    { id: "discounts" as TabType, label: "Discounts & Offers", icon: "🏷️" },
    { id: "addons" as TabType, label: "Add-Ons", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Pass & Pricing Configuration
          </h1>
          <p className="mt-2 text-gray-600">
            Configure pass types, pricing tiers, discounts, and add-on services
          </p>
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
        <div className="rounded-lg bg-white shadow-sm">
          {activeTab === "passes" && <PassTypeManager />}
          {activeTab === "discounts" && <DiscountsManager />}
          {activeTab === "addons" && <AddOnsManager />}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">3</p>
                <p className="mt-1 text-sm text-gray-600">Active Pass Types</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="mt-1 text-sm text-gray-600">Active Discounts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">Rs. 1,500</p>
                <p className="mt-1 text-sm text-gray-600">Avg. Pass Price</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">4</p>
                <p className="mt-1 text-sm text-gray-600">Add-On Services</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
