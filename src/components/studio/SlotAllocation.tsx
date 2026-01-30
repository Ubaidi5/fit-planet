"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  prioritySlots: number;
  status: "available" | "limited" | "full" | "blocked";
}

interface BlockedPeriod {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  slotsBlocked: number;
}

export default function SlotAllocation() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "06:00",
      endTime: "09:00",
      totalSlots: 80,
      bookedSlots: 45,
      blockedSlots: 0,
      prioritySlots: 10,
      status: "available",
    },
    {
      id: "2",
      startTime: "09:00",
      endTime: "12:00",
      totalSlots: 70,
      bookedSlots: 35,
      blockedSlots: 0,
      prioritySlots: 5,
      status: "available",
    },
    {
      id: "3",
      startTime: "12:00",
      endTime: "15:00",
      totalSlots: 60,
      bookedSlots: 20,
      blockedSlots: 0,
      prioritySlots: 5,
      status: "available",
    },
    {
      id: "4",
      startTime: "15:00",
      endTime: "18:00",
      totalSlots: 80,
      bookedSlots: 55,
      blockedSlots: 0,
      prioritySlots: 10,
      status: "limited",
    },
    {
      id: "5",
      startTime: "18:00",
      endTime: "21:00",
      totalSlots: 90,
      bookedSlots: 85,
      blockedSlots: 0,
      prioritySlots: 15,
      status: "limited",
    },
    {
      id: "6",
      startTime: "21:00",
      endTime: "23:00",
      totalSlots: 50,
      bookedSlots: 15,
      blockedSlots: 0,
      prioritySlots: 5,
      status: "available",
    },
  ]);

  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([
    {
      id: "1",
      date: "2026-01-28",
      startTime: "10:00",
      endTime: "12:00",
      reason: "Equipment maintenance",
      slotsBlocked: 30,
    },
  ]);

  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockFormData, setBlockFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    reason: "",
    slotsBlocked: 0,
  });

  const getSlotStatus = (slot: TimeSlot) => {
    const availableSlots =
      slot.totalSlots - slot.bookedSlots - slot.blockedSlots;
    const percentage = (availableSlots / slot.totalSlots) * 100;

    if (slot.blockedSlots === slot.totalSlots) return "blocked";
    if (availableSlots === 0) return "full";
    if (percentage < 20) return "limited";
    return "available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800";
      case "limited":
        return "bg-orange-100 text-orange-800";
      case "full":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "limited":
        return "Limited";
      case "full":
        return "Full";
      case "blocked":
        return "Blocked";
      default:
        return "Unknown";
    }
  };

  const handleBlockPeriod = () => {
    if (!blockFormData.startTime || !blockFormData.endTime) {
      alert("Please fill all required fields");
      return;
    }

    setBlockedPeriods((prev) => [
      ...prev,
      {
        ...blockFormData,
        id: `block-${Date.now()}`,
      },
    ]);

    setBlockFormData({
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      reason: "",
      slotsBlocked: 0,
    });
    setShowBlockForm(false);
  };

  const handleUnblock = (id: string) => {
    if (confirm("Are you sure you want to unblock this period?")) {
      setBlockedPeriods((prev) => prev.filter((period) => period.id !== id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Date Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Slot Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            View and manage slot allocations by time period
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Button
            fullWidth
            variant="outline"
            onClick={() => setShowBlockForm(true)}
          >
            🚫 Block Period
          </Button>
        </div>
      </div>

      {/* Block Period Form */}
      {showBlockForm && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Block Time Period
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>
              <Input
                type="date"
                value={blockFormData.date}
                onChange={(e) =>
                  setBlockFormData((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slots to Block
              </label>
              <Input
                type="number"
                min="0"
                value={blockFormData.slotsBlocked}
                onChange={(e) =>
                  setBlockFormData((prev) => ({
                    ...prev,
                    slotsBlocked: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <Input
                type="time"
                value={blockFormData.startTime}
                onChange={(e) =>
                  setBlockFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Time
              </label>
              <Input
                type="time"
                value={blockFormData.endTime}
                onChange={(e) =>
                  setBlockFormData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reason for Blocking
              </label>
              <Input
                type="text"
                placeholder="e.g., Equipment maintenance, Special event"
                value={blockFormData.reason}
                onChange={(e) =>
                  setBlockFormData((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowBlockForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleBlockPeriod}>Block Period</Button>
          </div>
        </div>
      )}

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {timeSlots.map((slot) => {
          const status = getSlotStatus(slot);
          const availableSlots =
            slot.totalSlots - slot.bookedSlots - slot.blockedSlots;

          return (
            <div
              key={slot.id}
              className="rounded-lg border-2 border-gray-200 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {slot.startTime} - {slot.endTime}
                  </h3>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      getStatusColor(status),
                    )}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {availableSlots}
                  </p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Utilization</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(
                      ((slot.bookedSlots + slot.blockedSlots) /
                        slot.totalSlots) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="flex h-4 overflow-hidden rounded-full bg-gray-200">
                  {/* Booked */}
                  <div
                    className="bg-emerald-500"
                    style={{
                      width: `${(slot.bookedSlots / slot.totalSlots) * 100}%`,
                    }}
                    title={`${slot.bookedSlots} booked`}
                  />
                  {/* Blocked */}
                  {slot.blockedSlots > 0 && (
                    <div
                      className="bg-gray-400"
                      style={{
                        width: `${(slot.blockedSlots / slot.totalSlots) * 100}%`,
                      }}
                      title={`${slot.blockedSlots} blocked`}
                    />
                  )}
                </div>
              </div>

              {/* Breakdown */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {slot.totalSlots}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Booked</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {slot.bookedSlots}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Priority</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {slot.prioritySlots}
                  </p>
                </div>
              </div>

              {slot.blockedSlots > 0 && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {slot.blockedSlots} slots blocked
                    </span>{" "}
                    - Maintenance scheduled
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Blocked Periods */}
      {blockedPeriods.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Blocked Periods
          </h3>
          <div className="space-y-3">
            {blockedPeriods.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(period.date).toLocaleDateString()} •{" "}
                        {period.startTime} - {period.endTime}
                      </p>
                      <p className="text-sm text-gray-600">{period.reason}</p>
                      <p className="text-xs text-gray-500">
                        {period.slotsBlocked} slots blocked
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(period.id)}
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-emerald-500" />
            <span className="text-sm text-gray-700">Booked Slots</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-400" />
            <span className="text-sm text-gray-700">Blocked Slots</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <span className="text-sm text-gray-700">Available Slots</span>
          </div>
        </div>
      </div>
    </div>
  );
}
