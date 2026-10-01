"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface TimeSlotCapacity {
  startTime: string;
  endTime: string;
  capacity: number;
}

interface CapacityConfig {
  maxCapacity: number;
  memberSlots: number;
  dayPassSlots: number;
  bufferPercentage: number;
  enablePeakHourAdjustment: boolean;
  peakHours: TimeSlotCapacity[];
  enableAutoAlert: boolean;
  alertThreshold: number;
  enableWaitlist: boolean;
  maxWaitlistSize: number;
}

export default function CapacitySettings() {
  const [config, setConfig] = useState<CapacityConfig>({
    maxCapacity: 100,
    memberSlots: 70,
    dayPassSlots: 30,
    bufferPercentage: 10,
    enablePeakHourAdjustment: true,
    peakHours: [
      { startTime: "06:00", endTime: "09:00", capacity: 80 },
      { startTime: "17:00", endTime: "21:00", capacity: 90 },
    ],
    enableAutoAlert: true,
    alertThreshold: 85,
    enableWaitlist: true,
    maxWaitlistSize: 20,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save capacity settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Capacity settings saved:", config);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const addPeakHour = () => {
    setConfig((prev) => ({
      ...prev,
      peakHours: [
        ...prev.peakHours,
        { startTime: "12:00", endTime: "14:00", capacity: 70 },
      ],
    }));
  };

  const removePeakHour = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      peakHours: prev.peakHours.filter((_, i) => i !== index),
    }));
  };

  const updatePeakHour = (
    index: number,
    field: keyof TimeSlotCapacity,
    value: string | number,
  ) => {
    setConfig((prev) => ({
      ...prev,
      peakHours: prev.peakHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour,
      ),
    }));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Basic Capacity Settings */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Basic Capacity Settings
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Maximum Capacity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              value={config.maxCapacity}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  maxCapacity: parseInt(e.target.value) || 0,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Total number of people allowed at once
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Buffer Percentage
            </label>
            <Input
              type="number"
              min="0"
              max="30"
              value={config.bufferPercentage}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  bufferPercentage: parseInt(e.target.value) || 0,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Safety buffer (e.g., 10% means stop at 90 people if max is 100)
            </p>
          </div>
        </div>
      </div>

      {/* Slot Allocation */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Slot Allocation
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Reserve slots for different user types. Total should not exceed max
          capacity.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Member Reserved Slots
            </label>
            <Input
              type="number"
              min="0"
              max={config.maxCapacity}
              value={config.memberSlots}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  memberSlots: parseInt(e.target.value) || 0,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Slots reserved for monthly/annual members
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Day Pass Slots
            </label>
            <Input
              type="number"
              min="0"
              max={config.maxCapacity}
              value={config.dayPassSlots}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  dayPassSlots: parseInt(e.target.value) || 0,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Slots available for day pass bookings
            </p>
          </div>
        </div>

        {/* Allocation Visual */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Allocation Breakdown
          </p>
          <div className="flex h-8 overflow-hidden rounded-lg">
            <div
              className="flex items-center justify-center bg-emerald-500 text-xs font-semibold text-white"
              style={{
                width: `${(config.memberSlots / config.maxCapacity) * 100}%`,
              }}
            >
              {config.memberSlots > 0 && `${config.memberSlots} Members`}
            </div>
            <div
              className="flex items-center justify-center bg-blue-500 text-xs font-semibold text-white"
              style={{
                width: `${(config.dayPassSlots / config.maxCapacity) * 100}%`,
              }}
            >
              {config.dayPassSlots > 0 && `${config.dayPassSlots} Day Pass`}
            </div>
            {config.memberSlots + config.dayPassSlots < config.maxCapacity && (
              <div
                className="flex items-center justify-center bg-gray-300 text-xs font-semibold text-gray-700"
                style={{
                  width: `${((config.maxCapacity - config.memberSlots - config.dayPassSlots) / config.maxCapacity) * 100}%`,
                }}
              >
                {config.maxCapacity - config.memberSlots - config.dayPassSlots}{" "}
                Free
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Peak Hour Adjustments */}
      <div className="border-t border-gray-200 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Peak Hour Capacity Adjustments
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Set different capacity limits for peak hours
            </p>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.enablePeakHourAdjustment}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  enablePeakHourAdjustment: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable Peak Hours
            </span>
          </label>
        </div>

        {config.enablePeakHourAdjustment && (
          <div className="space-y-4">
            {config.peakHours.map((hour, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft"
              >
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={hour.startTime}
                      onChange={(e) =>
                        updatePeakHour(index, "startTime", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={hour.endTime}
                      onChange={(e) =>
                        updatePeakHour(index, "endTime", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Capacity Limit
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={config.maxCapacity}
                      value={hour.capacity}
                      onChange={(e) =>
                        updatePeakHour(
                          index,
                          "capacity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removePeakHour(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPeakHour}
              className="w-full"
            >
              + Add Peak Hour Period
            </Button>
          </div>
        )}
      </div>

      {/* Alerts & Notifications */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Alerts & Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="enableAutoAlert"
              checked={config.enableAutoAlert}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  enableAutoAlert: e.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1">
              <label
                htmlFor="enableAutoAlert"
                className="block text-sm font-medium text-gray-700"
              >
                Enable Auto Alerts
              </label>
              <p className="mt-1 text-sm text-gray-600">
                Receive notifications when capacity reaches threshold
              </p>

              {config.enableAutoAlert && (
                <div className="mt-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Alert Threshold (%)
                  </label>
                  <Input
                    type="number"
                    min="50"
                    max="100"
                    value={config.alertThreshold}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        alertThreshold: parseInt(e.target.value) || 85,
                      }))
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Alert when capacity reaches {config.alertThreshold}% (
                    {Math.round(
                      (config.alertThreshold / 100) * config.maxCapacity,
                    )}{" "}
                    people)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Settings */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Waitlist Management
        </h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="enableWaitlist"
              checked={config.enableWaitlist}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  enableWaitlist: e.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1">
              <label
                htmlFor="enableWaitlist"
                className="block text-sm font-medium text-gray-700"
              >
                Enable Waitlist
              </label>
              <p className="mt-1 text-sm text-gray-600">
                Allow users to join waitlist when capacity is full
              </p>

              {config.enableWaitlist && (
                <div className="mt-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maximum Waitlist Size
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={config.maxWaitlistSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        maxWaitlistSize: parseInt(e.target.value) || 20,
                      }))
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum number of people on waitlist
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button variant="outline" type="button">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
