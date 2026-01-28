"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";

interface ActiveMember {
  id: string;
  name: string;
  phone: string;
  passType: "Monthly" | "Weekly" | "Day Pass" | "Yearly";
  checkInTime: string;
  duration: string;
  status: "active" | "leaving-soon";
}

export default function ActiveMembers() {
  const [filter, setFilter] = useState<"all" | "members" | "day-pass">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeMembers: ActiveMember[] = [
    {
      id: "1",
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      passType: "Monthly",
      checkInTime: "08:30 AM",
      duration: "2h 15m",
      status: "active",
    },
    {
      id: "2",
      name: "Sara Ali",
      phone: "+92 321 9876543",
      passType: "Day Pass",
      checkInTime: "09:15 AM",
      duration: "1h 45m",
      status: "active",
    },
    {
      id: "3",
      name: "Hamza Malik",
      phone: "+92 333 4567890",
      passType: "Weekly",
      checkInTime: "10:00 AM",
      duration: "1h 20m",
      status: "active",
    },
    {
      id: "4",
      name: "Fatima Sheikh",
      phone: "+92 345 2345678",
      passType: "Monthly",
      checkInTime: "07:45 AM",
      duration: "3h 10m",
      status: "leaving-soon",
    },
    {
      id: "5",
      name: "Usman Ahmed",
      phone: "+92 312 8765432",
      passType: "Day Pass",
      checkInTime: "10:30 AM",
      duration: "55m",
      status: "active",
    },
    {
      id: "6",
      name: "Ayesha Raza",
      phone: "+92 301 5556789",
      passType: "Yearly",
      checkInTime: "08:00 AM",
      duration: "2h 45m",
      status: "active",
    },
  ];

  const filteredMembers = activeMembers.filter((member) => {
    // Apply filter
    if (filter === "members" && member.passType === "Day Pass") return false;
    if (filter === "day-pass" && member.passType !== "Day Pass") return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.phone.includes(query)
      );
    }

    return true;
  });

  const getPassTypeColor = (passType: string) => {
    switch (passType) {
      case "Monthly":
        return "bg-emerald-100 text-emerald-800";
      case "Weekly":
        return "bg-blue-100 text-blue-800";
      case "Day Pass":
        return "bg-purple-100 text-purple-800";
      case "Yearly":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCheckOut = (memberId: string) => {
    if (confirm("Are you sure you want to check out this member?")) {
      // In production, call API to check out
      console.log("Checking out member:", memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Currently Inside
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">42</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">28</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🏋️</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Day Passes</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">14</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                filter === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              All ({activeMembers.length})
            </button>
            <button
              onClick={() => setFilter("members")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                filter === "members"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Members (
              {activeMembers.filter((m) => m.passType !== "Day Pass").length})
            </button>
            <button
              onClick={() => setFilter("day-pass")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                filter === "day-pass"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Day Pass (
              {activeMembers.filter((m) => m.passType === "Day Pass").length})
            </button>
          </div>

          <div className="flex-1 sm:ml-4 sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Active Members List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-600">
                <th className="p-4">Member</th>
                <th className="p-4">Pass Type</th>
                <th className="p-4">Check-In Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No active members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-white">
                          <span className="text-sm font-bold">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          getPassTypeColor(member.passType),
                        )}
                      >
                        {member.passType}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {member.checkInTime}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {member.duration}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-semibold",
                          member.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800",
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            member.status === "active"
                              ? "bg-emerald-500"
                              : "bg-orange-500",
                          )}
                        />
                        <span>
                          {member.status === "active"
                            ? "Active"
                            : "Leaving Soon"}
                        </span>
                      </span>
                    </td>

                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckOut(member.id)}
                      >
                        Check Out
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {filteredMembers.length} of {activeMembers.length} active
            members
          </p>
        </div>
      </div>
    </div>
  );
}
