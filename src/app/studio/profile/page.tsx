"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ServicesManager from "@/components/studio/ServicesManager";
import BasicInfoForm from "@/components/studio/BasicInfoForm";
import AmenitiesSelector from "@/components/studio/AmenitiesSelector";
import PhotoGalleryManager from "@/components/studio/PhotoGalleryManager";

type TabType = "basic" | "photos" | "amenities" | "services";

export default function StudioProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "basic" as TabType, label: "Basic Information", icon: "🏢" },
    { id: "photos" as TabType, label: "Photos & Gallery", icon: "📸" },
    { id: "amenities" as TabType, label: "Amenities", icon: "✨" },
    { id: "services" as TabType, label: "Services", icon: "💪" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">Gym Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your gym information, photos, amenities, and services
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
        <div className="rounded-3xl bg-surface shadow-soft">
          {activeTab === "basic" && <BasicInfoForm />}
          {activeTab === "photos" && <PhotoGalleryManager />}
          {activeTab === "amenities" && <AmenitiesSelector />}
          {activeTab === "services" && <ServicesManager />}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-emerald-600 tracking-tight">85%</p>
                <p className="mt-1 text-sm text-gray-600">Profile Complete</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-blue-600 tracking-tight">12</p>
                <p className="mt-1 text-sm text-gray-600">Photos Uploaded</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-600 tracking-tight">8</p>
                <p className="mt-1 text-sm text-gray-600">Amenities Added</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold text-orange-600 tracking-tight">5</p>
                <p className="mt-1 text-sm text-gray-600">Services Listed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
