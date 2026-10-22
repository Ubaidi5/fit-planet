"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MemberStat {
  name: string;
  phone: string;
  passType: string;
  visits: number;
  lastVisit: string;
  avgDuration: string;
  status: "active" | "inactive" | "new";
}

export default function MemberInsights() {
  const topMembers: MemberStat[] = [
    {
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      passType: "Monthly",
      visits: 28,
      lastVisit: "Today",
      avgDuration: "2h 15m",
      status: "active",
    },
    {
      name: "Sara Ali",
      phone: "+92 321 9876543",
      passType: "Monthly",
      visits: 25,
      lastVisit: "Today",
      avgDuration: "1h 45m",
      status: "active",
    },
    {
      name: "Hamza Malik",
      phone: "+92 333 4567890",
      passType: "Yearly",
      visits: 24,
      lastVisit: "Yesterday",
      avgDuration: "2h 30m",
      status: "active",
    },
    {
      name: "Fatima Sheikh",
      phone: "+92 345 2345678",
      passType: "Monthly",
      visits: 22,
      lastVisit: "2 days ago",
      avgDuration: "1h 50m",
      status: "active",
    },
    {
      name: "Usman Ahmed",
      phone: "+92 312 8765432",
      passType: "Weekly",
      visits: 15,
      lastVisit: "Today",
      avgDuration: "1h 30m",
      status: "active",
    },
  ];

  const inactiveMembers: MemberStat[] = [
    {
      name: "Ali Hassan",
      phone: "+92 322 7778888",
      passType: "Monthly",
      visits: 8,
      lastVisit: "15 days ago",
      avgDuration: "1h 20m",
      status: "inactive",
    },
    {
      name: "Zainab Khan",
      phone: "+92 313 9990000",
      passType: "Monthly",
      visits: 5,
      lastVisit: "20 days ago",
      avgDuration: "1h 10m",
      status: "inactive",
    },
    {
      name: "Bilal Ahmed",
      phone: "+92 334 1112222",
      passType: "Yearly",
      visits: 12,
      lastVisit: "12 days ago",
      avgDuration: "2h 00m",
      status: "inactive",
    },
  ];

  const newMembers: MemberStat[] = [
    {
      name: "Maria Khan",
      phone: "+92 301 3334444",
      passType: "Monthly",
      visits: 3,
      lastVisit: "Today",
      avgDuration: "1h 15m",
      status: "new",
    },
    {
      name: "Asad Raza",
      phone: "+92 323 5556666",
      passType: "Weekly",
      visits: 2,
      lastVisit: "Yesterday",
      avgDuration: "1h 00m",
      status: "new",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Engagement Overview */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Engagement Overview
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-700">
                Active Members
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900 tracking-tight">85</p>
              <p className="mt-1 text-xs text-emerald-600">
                Visited in last 7 days
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-700">
                Inactive Members
              </p>
              <p className="mt-2 text-3xl font-semibold text-orange-900 tracking-tight">23</p>
              <p className="mt-1 text-xs text-orange-600">
                No visit for 14+ days
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">New Members</p>
              <p className="mt-2 text-3xl font-semibold text-blue-900 tracking-tight">12</p>
              <p className="mt-1 text-xs text-blue-600">Joined this month</p>
            </div>
          </div>

          {/* Average Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <p className="text-sm text-gray-600">Avg Visits/Member</p>
              <p className="mt-1 text-2xl font-semibold text-ink tracking-tight">18.5</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Session Duration</p>
              <p className="mt-1 text-2xl font-semibold text-ink tracking-tight">1h 45m</p>
              <p className="text-xs text-gray-500">per visit</p>
            </div>
          </div>
        </div>

        {/* Member Feedback */}
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Member Satisfaction
          </h3>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Overall Rating
                </span>
                <span className="text-2xl font-semibold text-emerald-600 tracking-tight">4.7</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn(
                      "text-xl",
                      star <= 4 ? "text-yellow-400" : "text-gray-300",
                    )}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">Equipment</span>
                  <span className="font-semibold text-gray-900">4.8</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[96%] bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">Cleanliness</span>
                  <span className="font-semibold text-gray-900">4.9</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[98%] bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">Staff</span>
                  <span className="font-semibold text-gray-900">4.6</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[92%] bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">Value</span>
                  <span className="font-semibold text-gray-900">4.5</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[90%] bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Frequent Visitors */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Frequent Visitors
            </h3>
            <p className="text-sm text-gray-600">
              Most active members this month
            </p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {topMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-white">
                  <span className="text-lg font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">
                    {member.passType} • {member.phone}
                  </p>
                </div>
              </div>

              <div className="text-end">
                <p className="text-2xl font-semibold text-emerald-600 tracking-tight">
                  {member.visits}
                </p>
                <p className="text-xs text-gray-600">visits</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Members - Re-engagement Needed */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-orange-900">
              ⚠️ Inactive Members
            </h3>
            <p className="text-sm text-orange-700">
              Members who haven't visited in 14+ days
            </p>
          </div>
          <Button variant="outline" size="sm">
            Send Re-engagement Email
          </Button>
        </div>

        <div className="space-y-3">
          {inactiveMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-3xl border border-orange-200 bg-surface p-4 shadow-soft"
            >
              <div>
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">
                  {member.passType} • {member.phone}
                </p>
              </div>

              <div className="text-end">
                <p className="text-sm font-semibold text-orange-600">
                  Last visit: {member.lastVisit}
                </p>
                <p className="text-xs text-gray-600">
                  {member.visits} visits total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Members */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              🎉 New Members
            </h3>
            <p className="text-sm text-blue-700">
              Recently joined members this month
            </p>
          </div>
          <Button variant="outline" size="sm">
            Send Welcome Message
          </Button>
        </div>

        <div className="space-y-3">
          {newMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-3xl border border-blue-200 bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👋</span>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">
                    {member.passType} • {member.phone}
                  </p>
                </div>
              </div>

              <div className="text-end">
                <p className="text-sm font-semibold text-blue-600">
                  {member.visits} visits
                </p>
                <p className="text-xs text-gray-600">
                  Last: {member.lastVisit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
