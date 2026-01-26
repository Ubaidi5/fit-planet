"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Mock user data
const mockUser = {
  id: "user123",
  fullName: "Muhammad Ali",
  email: "muhammad.ali@example.com",
  phone: "+92 300 1234567",
  gender: "male" as const,
  dateOfBirth: "1995-06-15",
  avatar: null,
  memberSince: "2025-06-01",
  stats: {
    totalCheckIns: 47,
    gymsVisited: 5,
    activePasses: 1,
    streakDays: 12,
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    marketingEmails: false,
  },
};

type TabType = "profile" | "security" | "preferences";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ ...user, ...formData });
    setIsSaving(false);
    setIsEditing(false);
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "👤" },
    { id: "security" as const, label: "Security", icon: "🔒" },
    { id: "preferences" as const, label: "Preferences", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings</p>
            </div>
            <Link href="/app/dashboard">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* User Summary */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  user.fullName.charAt(0)
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.fullName}
              </h2>
              <p className="text-gray-600">{user.phone}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="success">Verified</Badge>
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(user.memberSince).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user.stats.totalCheckIns}
              </p>
              <p className="text-sm text-gray-600">Total Check-ins</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user.stats.gymsVisited}
              </p>
              <p className="text-sm text-gray-600">Gyms Visited</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user.stats.activePasses}
              </p>
              <p className="text-sm text-gray-600">Active Passes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                🔥 {user.stats.streakDays}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                  activeTab === tab.id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user.fullName,
                        email: user.email,
                        gender: user.gender,
                        dateOfBirth: user.dateOfBirth,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    loading={isSaving}
                    loadingText="Saving..."
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900">{user.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">{user.phone}</p>
                    <Badge variant="success" size="sm">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Phone number cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as typeof user.gender,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{user.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-900">
                      {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Phone Verification
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                      <p className="text-sm text-gray-500">
                        Your phone number is verified
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    action: "Logged in",
                    device: "Chrome on Windows",
                    time: "Today, 9:30 AM",
                  },
                  {
                    action: "Check-in at FitZone Karachi",
                    device: "Mobile App",
                    time: "Yesterday, 6:15 PM",
                  },
                  {
                    action: "Booked Monthly Pass",
                    device: "Chrome on Windows",
                    time: "Jan 20, 2026",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.device}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Danger Zone
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Deleting your account will remove all your data, passes, and
                check-in history permanently.
              </p>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification Preferences
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                {
                  key: "notifications",
                  title: "Push Notifications",
                  description: "Receive alerts about check-ins and pass expiry",
                },
                {
                  key: "emailUpdates",
                  title: "Email Updates",
                  description:
                    "Get booking confirmations and pass details via email",
                },
                {
                  key: "marketingEmails",
                  title: "Marketing Emails",
                  description: "Receive offers, promotions, and gym updates",
                },
              ].map((pref) => (
                <div
                  key={pref.key}
                  className="p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{pref.title}</p>
                    <p className="text-sm text-gray-500">{pref.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        user.preferences[
                          pref.key as keyof typeof user.preferences
                        ]
                      }
                      onChange={() =>
                        setUser({
                          ...user,
                          preferences: {
                            ...user.preferences,
                            [pref.key]:
                              !user.preferences[
                                pref.key as keyof typeof user.preferences
                              ],
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
