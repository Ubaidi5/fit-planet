"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  type: "seasonal" | "flash-sale" | "new-year" | "limited-time";
  discount: number;
  discountType: "percentage" | "fixed";
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "ended";
  redemptions: number;
  revenue: number;
  passTypes: string[];
}

export default function PromotionalCampaigns() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "limited-time",
    discount: 0,
    discountType: "percentage",
    startDate: "",
    endDate: "",
    passTypes: [] as string[],
    description: "",
  });

  const campaigns: Campaign[] = [
    {
      id: "1",
      title: "New Year Fitness Challenge",
      type: "new-year",
      discount: 30,
      discountType: "percentage",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      status: "active",
      redemptions: 45,
      revenue: 67500,
      passTypes: ["Monthly", "Yearly"],
    },
    {
      id: "2",
      title: "Weekend Flash Sale",
      type: "flash-sale",
      discount: 500,
      discountType: "fixed",
      startDate: "2026-01-25",
      endDate: "2026-01-27",
      status: "active",
      redemptions: 28,
      revenue: 42000,
      passTypes: ["Day Pass", "Weekly"],
    },
    {
      id: "3",
      title: "Summer Body Prep",
      type: "seasonal",
      discount: 25,
      discountType: "percentage",
      startDate: "2026-03-01",
      endDate: "2026-04-30",
      status: "scheduled",
      redemptions: 0,
      revenue: 0,
      passTypes: ["Monthly", "Quarterly"],
    },
    {
      id: "4",
      title: "Student Special",
      type: "limited-time",
      discount: 20,
      discountType: "percentage",
      startDate: "2025-12-01",
      endDate: "2026-01-15",
      status: "ended",
      redemptions: 62,
      revenue: 93000,
      passTypes: ["Monthly"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "new-year":
        return "🎊";
      case "flash-sale":
        return "⚡";
      case "seasonal":
        return "🌞";
      case "limited-time":
        return "⏰";
      default:
        return "🎉";
    }
  };

  const handleCreateCampaign = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields");
      return;
    }

    // In production, call API to create campaign
    console.log("Creating campaign:", formData);
    setShowCreateForm(false);
    setFormData({
      title: "",
      type: "limited-time",
      discount: 0,
      discountType: "percentage",
      startDate: "",
      endDate: "",
      passTypes: [],
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "➕ Create New Campaign"}
        </Button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Create New Campaign
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign Title *
              </label>
              <input
                type="text"
                placeholder="e.g., New Year Special Offer"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="limited-time">Limited Time</option>
                <option value="flash-sale">Flash Sale</option>
                <option value="seasonal">Seasonal</option>
                <option value="new-year">New Year</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountType: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Value *
              </label>
              <input
                type="number"
                min="0"
                placeholder={
                  formData.discountType === "percentage"
                    ? "e.g., 20"
                    : "e.g., 500"
                }
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Describe your campaign..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-lg border-2 border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <span className="text-4xl">{getTypeIcon(campaign.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                        getStatusColor(campaign.status),
                      )}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span className="font-semibold text-emerald-600">
                        {campaign.discount}
                        {campaign.discountType === "percentage"
                          ? "%"
                          : " Rs."}{" "}
                        OFF
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {campaign.passTypes.map((passType) => (
                      <span
                        key={passType}
                        className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                      >
                        {passType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-xs text-gray-600">Redemptions</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {campaign.redemptions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Revenue Generated</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  Rs. {(campaign.revenue / 1000).toFixed(1)}K
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg. Discount</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {campaign.discountType === "percentage"
                    ? `${campaign.discount}%`
                    : `Rs. ${campaign.discount}`}
                </p>
              </div>
            </div>

            {/* Actions */}
            {campaign.status === "active" && (
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  📱 Share on Social Media
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  📧 Send Email Campaign
                </Button>
                <Button variant="outline" size="sm">
                  ⏸ Pause
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Campaign Templates */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Templates
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50">
            <span className="mb-2 block text-3xl">🎊</span>
            <p className="text-sm font-semibold text-gray-900">New Year Sale</p>
            <p className="text-xs text-gray-600">30% off all passes</p>
          </button>

          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50">
            <span className="mb-2 block text-3xl">⚡</span>
            <p className="text-sm font-semibold text-gray-900">Flash Sale</p>
            <p className="text-xs text-gray-600">24-hour limited offer</p>
          </button>

          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50">
            <span className="mb-2 block text-3xl">🎓</span>
            <p className="text-sm font-semibold text-gray-900">
              Student Discount
            </p>
            <p className="text-xs text-gray-600">20% off with ID</p>
          </button>

          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50">
            <span className="mb-2 block text-3xl">🌞</span>
            <p className="text-sm font-semibold text-gray-900">
              Summer Special
            </p>
            <p className="text-xs text-gray-600">Season-long deals</p>
          </button>
        </div>
      </div>
    </div>
  );
}
