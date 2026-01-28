"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export function NotificationPreferences() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: "push",
      name: "Push Notifications",
      description: "Receive instant notifications on your device",
      icon: "📱",
      enabled: true,
    },
    {
      id: "email",
      name: "Email",
      description: "Get updates and summaries via email",
      icon: "📧",
      enabled: true,
    },
    {
      id: "sms",
      name: "SMS",
      description: "Critical alerts via text message",
      icon: "💬",
      enabled: false,
    },
  ]);

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: "booking",
      name: "Bookings & Passes",
      description: "Updates about your bookings and pass status",
      channels: { push: true, email: true, sms: false },
    },
    {
      id: "pass_expiry",
      name: "Pass Expiry",
      description: "Alerts when your passes are about to expire",
      channels: { push: true, email: true, sms: true },
    },
    {
      id: "checkin",
      name: "Check-ins",
      description: "Confirmations when you check in at a gym",
      channels: { push: true, email: false, sms: false },
    },
    {
      id: "friend",
      name: "Social Activity",
      description: "Updates from friends, followers, and workout buddies",
      channels: { push: true, email: false, sms: false },
    },
    {
      id: "achievement",
      name: "Achievements & Badges",
      description: "Celebrate your milestones and earned badges",
      channels: { push: true, email: true, sms: false },
    },
    {
      id: "promo",
      name: "Offers & Promotions",
      description: "Special deals and discounts from gyms",
      channels: { push: true, email: true, sms: false },
    },
    {
      id: "workout",
      name: "Workout Reminders",
      description: "Reminders to keep you on track with your fitness goals",
      channels: { push: true, email: false, sms: false },
    },
    {
      id: "system",
      name: "System Updates",
      description: "Important updates about your account and security",
      channels: { push: true, email: true, sms: true },
    },
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, enabled: !channel.enabled }
          : channel,
      ),
    );
  };

  const toggleCategoryChannel = (
    categoryId: string,
    channelType: "push" | "email" | "sms",
  ) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              channels: {
                ...category.channels,
                [channelType]: !category.channels[channelType],
              },
            }
          : category,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    console.log("Preferences saved:", { channels, categories, quietHours });
  };

  const getChannelIcon = (channelType: string) => {
    const channel = channels.find((c) => c.id === channelType);
    return channel?.icon || "🔔";
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Notification Channels
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Choose how you want to receive notifications
        </p>

        <div className="mt-6 space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{channel.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{channel.name}</h4>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleChannel(channel.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  channel.enabled ? "bg-emerald-600" : "bg-gray-200",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    channel.enabled ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Categories */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Notification Categories
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Control what types of notifications you receive
        </p>

        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>

              <div className="flex gap-4">
                {/* Push Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getChannelIcon("push")}</span>
                  <button
                    onClick={() => toggleCategoryChannel(category.id, "push")}
                    disabled={!channels.find((c) => c.id === "push")?.enabled}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      category.channels.push ? "bg-emerald-600" : "bg-gray-200",
                      !channels.find((c) => c.id === "push")?.enabled &&
                        "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                        category.channels.push
                          ? "translate-x-5"
                          : "translate-x-1",
                      )}
                    />
                  </button>
                </div>

                {/* Email Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getChannelIcon("email")}</span>
                  <button
                    onClick={() => toggleCategoryChannel(category.id, "email")}
                    disabled={!channels.find((c) => c.id === "email")?.enabled}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      category.channels.email
                        ? "bg-emerald-600"
                        : "bg-gray-200",
                      !channels.find((c) => c.id === "email")?.enabled &&
                        "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                        category.channels.email
                          ? "translate-x-5"
                          : "translate-x-1",
                      )}
                    />
                  </button>
                </div>

                {/* SMS Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getChannelIcon("sms")}</span>
                  <button
                    onClick={() => toggleCategoryChannel(category.id, "sms")}
                    disabled={!channels.find((c) => c.id === "sms")?.enabled}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      category.channels.sms ? "bg-emerald-600" : "bg-gray-200",
                      !channels.find((c) => c.id === "sms")?.enabled &&
                        "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                        category.channels.sms
                          ? "translate-x-5"
                          : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quiet Hours</h3>
            <p className="mt-1 text-sm text-gray-600">
              Pause notifications during specific hours
            </p>
          </div>
          <button
            onClick={() =>
              setQuietHours((prev) => ({ ...prev, enabled: !prev.enabled }))
            }
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              quietHours.enabled ? "bg-emerald-600" : "bg-gray-200",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                quietHours.enabled ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        </div>

        {quietHours.enabled && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={quietHours.startTime}
                onChange={(e) =>
                  setQuietHours((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                value={quietHours.endTime}
                onChange={(e) =>
                  setQuietHours((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  channels: { push: true, email: true, sms: false },
                })),
              );
            }}
          >
            Enable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  channels: { push: false, email: false, sms: false },
                })),
              );
            }}
          >
            Disable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategories((prev) =>
                prev.map((cat) => ({
                  ...cat,
                  channels: {
                    push: cat.id !== "promo",
                    email: false,
                    sms: cat.id === "pass_expiry" || cat.id === "system",
                  },
                })),
              );
            }}
          >
            Essential Only
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          loadingText="Saving..."
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
