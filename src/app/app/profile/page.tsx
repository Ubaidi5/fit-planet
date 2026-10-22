"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineCamera, HiOutlineCheckCircle } from "react-icons/hi";
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
    smsAlerts: true,
  },
  privacy: {
    profileVisibility: "friends" as "public" | "friends" | "private",
    showActivity: true,
    showRoutines: true,
    showStats: false,
  },
  paymentMethods: [
    {
      id: "pm1",
      type: "card" as const,
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    {
      id: "pm2",
      type: "card" as const,
      brand: "Mastercard",
      last4: "8888",
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false,
    },
  ],
};

type TabType = "profile" | "security" | "payments" | "privacy" | "preferences";

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
  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({ ...user, ...formData });
    setIsSaving(false);
    setIsEditing(false);
  };

  const setDefaultPayment = (paymentId: string) => {
    setUser({
      ...user,
      paymentMethods: user.paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === paymentId,
      })),
    });
  };

  const removePayment = (paymentId: string) => {
    setUser({
      ...user,
      paymentMethods: user.paymentMethods.filter((pm) => pm.id !== paymentId),
    });
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "👤" },
    { id: "security" as const, label: "Security", icon: "🔒" },
    { id: "payments" as const, label: "Payments", icon: "💳" },
    { id: "privacy" as const, label: "Privacy", icon: "👁️" },
    { id: "preferences" as const, label: "Preferences", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-ink tracking-tight">My Profile</h1>
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
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-semibold tracking-tight">
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
                <HiOutlineCamera className="w-4 h-4 text-gray-600" />
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
              <p className="text-2xl font-semibold text-ink tracking-tight">
                {user.stats.totalCheckIns}
              </p>
              <p className="text-sm text-gray-600">Total Check-ins</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-semibold text-ink tracking-tight">
                {user.stats.gymsVisited}
              </p>
              <p className="text-sm text-gray-600">Gyms Visited</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-semibold text-ink tracking-tight">
                {user.stats.activePasses}
              </p>
              <p className="text-sm text-gray-600">Active Passes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-semibold text-emerald-600 tracking-tight">
                🔥 {user.stats.streakDays}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 md:gap-6 mt-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0",
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
          <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
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
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Phone Verification
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
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

            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
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
          <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notification Preferences
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Control how and when you receive notifications
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    key: "notifications",
                    title: "Push Notifications",
                    description:
                      "Receive alerts about check-ins and pass expiry",
                    icon: "🔔",
                  },
                  {
                    key: "emailUpdates",
                    title: "Email Updates",
                    description:
                      "Get booking confirmations and pass details via email",
                    icon: "📧",
                  },
                  {
                    key: "smsAlerts",
                    title: "SMS Alerts",
                    description: "Receive important alerts via text message",
                    icon: "💬",
                  },
                  {
                    key: "marketingEmails",
                    title: "Marketing Emails",
                    description: "Receive offers, promotions, and gym updates",
                    icon: "📢",
                  },
                ].map((pref) => (
                  <div
                    key={pref.key}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{pref.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {pref.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {pref.description}
                        </p>
                      </div>
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

            {/* App Settings */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  App Settings
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">🌍</span>
                    <div>
                      <p className="font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">
                        Select your preferred language
                      </p>
                    </div>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                  </select>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">📏</span>
                    <div>
                      <p className="font-medium text-gray-900">Distance Unit</p>
                      <p className="text-sm text-gray-500">
                        Choose kilometers or miles
                      </p>
                    </div>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="km">Kilometers</option>
                    <option value="mi">Miles</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Methods
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your saved payment methods
                  </p>
                </div>
                <Button size="sm" onClick={() => setShowAddPayment(true)}>
                  + Add Card
                </Button>
              </div>

              {user.paymentMethods.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    No payment methods
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Add a card to make bookings faster
                  </p>
                  <Button size="sm" onClick={() => setShowAddPayment(true)}>
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {user.paymentMethods.map((method) => (
                    <div key={method.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold",
                              method.brand === "Visa"
                                ? "bg-blue-600"
                                : "bg-orange-500",
                            )}
                          >
                            {method.brand === "Visa" ? "VISA" : "MC"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {method.brand} ending in {method.last4}
                              </p>
                              {method.isDefault && (
                                <Badge variant="success" size="sm">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires{" "}
                              {method.expiryMonth.toString().padStart(2, "0")}/
                              {method.expiryYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDefaultPayment(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePayment(method.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Payment Modal */}
            {showAddPayment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
                <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add Payment Method
                    </h3>
                    <button
                      onClick={() => setShowAddPayment(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <Input placeholder="Name on card" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="setDefault"
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="setDefault"
                        className="text-sm text-gray-600"
                      >
                        Set as default payment method
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAddPayment(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setShowAddPayment(false)}
                    >
                      Add Card
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    🔒 Your payment info is encrypted and secure
                  </p>
                </div>
              </div>
            )}

            {/* Billing History */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Billing History
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View your recent transactions
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Download All
                </Button>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    id: "INV-001",
                    desc: "Monthly Pass - FitZone Karachi",
                    amount: 4999,
                    date: "Jan 20, 2026",
                    status: "paid",
                  },
                  {
                    id: "INV-002",
                    desc: "Day Pass - Iron Paradise",
                    amount: 500,
                    date: "Jan 15, 2026",
                    status: "paid",
                  },
                  {
                    id: "INV-003",
                    desc: "Weekly Pass - PowerHouse Gym",
                    amount: 1500,
                    date: "Jan 8, 2026",
                    status: "paid",
                  },
                ].map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {invoice.desc}
                        </p>
                        <p className="text-sm text-gray-500">
                          {invoice.date} • {invoice.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="font-semibold text-gray-900">
                        Rs. {invoice.amount.toLocaleString()}
                      </p>
                      <Badge variant="success" size="sm">
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 text-center">
                <Button variant="link" size="sm">
                  View All Transactions →
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-6">
            {/* Profile Visibility */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Visibility
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Control who can see your profile and activity
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who can see your profile?
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "public",
                      label: "Everyone",
                      desc: "Anyone on Fit Planet can view your profile",
                    },
                    {
                      value: "friends",
                      label: "Friends Only",
                      desc: "Only your fitness buddies can view your profile",
                    },
                    {
                      value: "private",
                      label: "Private",
                      desc: "Only you can see your profile details",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                        user.privacy.profileVisibility === option.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={
                          user.privacy.profileVisibility === option.value
                        }
                        onChange={() =>
                          setUser({
                            ...user,
                            privacy: {
                              ...user.privacy,
                              profileVisibility: option.value as
                                | "public"
                                | "friends"
                                | "private",
                            },
                          })
                        }
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Sharing */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activity Sharing
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose what others can see about your fitness journey
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    key: "showActivity",
                    title: "Show Workout Activity",
                    description: "Let others see when you check in at gyms",
                    icon: "🏃",
                  },
                  {
                    key: "showRoutines",
                    title: "Share Routines",
                    description:
                      "Allow your public routines to appear in social feed",
                    icon: "📋",
                  },
                  {
                    key: "showStats",
                    title: "Display Stats",
                    description: "Show your workout statistics on your profile",
                    icon: "📊",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{setting.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {setting.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          user.privacy[
                            setting.key as keyof typeof user.privacy
                          ] as boolean
                        }
                        onChange={() =>
                          setUser({
                            ...user,
                            privacy: {
                              ...user.privacy,
                              [setting.key]:
                                !user.privacy[
                                  setting.key as keyof typeof user.privacy
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

            {/* Data & Privacy */}
            <div className="bg-surface rounded-3xl border border-gray-900/[0.06] overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Data & Privacy
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Download Your Data
                    </p>
                    <p className="text-sm text-gray-500">
                      Get a copy of your Fit Planet data
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Request Data
                  </Button>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Blocked Users</p>
                    <p className="text-sm text-gray-500">
                      Manage users you&apos;ve blocked
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
