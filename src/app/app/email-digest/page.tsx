"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HiOutlineInformationCircle } from "react-icons/hi";

interface DigestPreference {
  id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "never";
  enabled: boolean;
  time?: string; // For daily/weekly
  dayOfWeek?: number; // 0-6 for weekly (0 = Sunday)
  dayOfMonth?: number; // 1-31 for monthly
}

export default function EmailDigestPage() {
  const [preferences, setPreferences] = useState<DigestPreference[]>([
    {
      id: "activity_summary",
      name: "Activity Summary",
      description: "Overview of your workouts, check-ins, and achievements",
      frequency: "weekly",
      enabled: true,
      time: "08:00",
      dayOfWeek: 1, // Monday
    },
    {
      id: "pass_expiry",
      name: "Pass Expiry Reminders",
      description: "Upcoming pass expirations and renewal reminders",
      frequency: "weekly",
      enabled: true,
      time: "09:00",
      dayOfWeek: 5, // Friday
    },
    {
      id: "promo_deals",
      name: "Offers & Promotions",
      description: "Special deals and discounts from gyms near you",
      frequency: "weekly",
      enabled: true,
      time: "10:00",
      dayOfWeek: 0, // Sunday
    },
    {
      id: "friend_activity",
      name: "Friend Activity",
      description: "Updates from your workout buddies and followers",
      frequency: "daily",
      enabled: false,
      time: "18:00",
    },
    {
      id: "new_gyms",
      name: "New Gyms Nearby",
      description: "Notifications when new gyms open in your area",
      frequency: "monthly",
      enabled: true,
      dayOfMonth: 1,
      time: "09:00",
    },
    {
      id: "monthly_report",
      name: "Monthly Fitness Report",
      description: "Comprehensive report of your fitness journey",
      frequency: "monthly",
      enabled: true,
      dayOfMonth: 1,
      time: "07:00",
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const updatePreference = (id: string, updates: Partial<DigestPreference>) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, ...updates } : pref)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    console.log("Email digest preferences saved:", preferences);
  };

  const getDayName = (day: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  const getFrequencyLabel = (pref: DigestPreference) => {
    if (pref.frequency === "never") return "Never";
    if (pref.frequency === "daily") return `Daily at ${pref.time}`;
    if (pref.frequency === "weekly")
      return `Weekly on ${getDayName(pref.dayOfWeek || 0)} at ${pref.time}`;
    if (pref.frequency === "monthly")
      return `Monthly on day ${pref.dayOfMonth} at ${pref.time}`;
    return pref.frequency;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Email Digest</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure how often you receive email summaries and updates
        </p>
      </div>

      {/* Quick Settings */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="font-semibold text-gray-900">Quick Settings</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPreferences((prev) =>
                prev.map((p) => ({ ...p, enabled: true })),
              )
            }
          >
            Enable All Digests
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPreferences((prev) =>
                prev.map((p) => ({ ...p, enabled: false })),
              )
            }
          >
            Disable All Digests
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPreferences((prev) =>
                prev.map((p) =>
                  p.id === "monthly_report" || p.id === "pass_expiry"
                    ? { ...p, enabled: true }
                    : { ...p, enabled: false },
                ),
              )
            }
          >
            Essential Only
          </Button>
        </div>
      </div>

      {/* Digest Preferences */}
      <div className="space-y-4">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{pref.name}</h3>
                  {pref.enabled && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{pref.description}</p>
                {pref.enabled && (
                  <p className="mt-2 text-xs text-gray-500">
                    {getFrequencyLabel(pref)}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  updatePreference(pref.id, { enabled: !pref.enabled })
                }
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  pref.enabled ? "bg-emerald-600" : "bg-gray-200",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    pref.enabled ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>

            {/* Frequency Settings */}
            {pref.enabled && (
              <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <select
                    value={pref.frequency}
                    onChange={(e) =>
                      updatePreference(pref.id, {
                        frequency: e.target
                          .value as DigestPreference["frequency"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {pref.frequency === "daily" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      value={pref.time}
                      onChange={(e) =>
                        updatePreference(pref.id, { time: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {pref.frequency === "weekly" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Day of Week
                      </label>
                      <select
                        value={pref.dayOfWeek}
                        onChange={(e) =>
                          updatePreference(pref.id, {
                            dayOfWeek: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value={0}>Sunday</option>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        type="time"
                        value={pref.time}
                        onChange={(e) =>
                          updatePreference(pref.id, { time: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {pref.frequency === "monthly" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Day of Month
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={pref.dayOfMonth}
                        onChange={(e) =>
                          updatePreference(pref.id, {
                            dayOfMonth: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        type="time"
                        value={pref.time}
                        onChange={(e) =>
                          updatePreference(pref.id, { time: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <HiOutlineInformationCircle className="h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900">About Email Digests</h4>
            <p className="mt-1 text-sm text-blue-800">
              Email digests combine multiple notifications into a single email
              to reduce inbox clutter. You'll still receive important real-time
              notifications via push and SMS if enabled.
            </p>
          </div>
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
