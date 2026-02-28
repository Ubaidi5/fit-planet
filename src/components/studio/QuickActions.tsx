"use client";

import Link from "next/link";
import { HiOutlineChevronRight } from "react-icons/hi";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  bgColor: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: "1",
      title: "Gym Profile",
      description: "Update details & photos",
      icon: "🏢",
      href: "/studio/profile",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      id: "2",
      title: "Manage Passes",
      description: "Configure pricing",
      icon: "🎫",
      href: "/studio/passes",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
    },
    {
      id: "3",
      title: "Capacity",
      description: "Monitor & manage",
      icon: "👥",
      href: "/studio/capacity",
      color: "text-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
    },
    {
      id: "4",
      title: "Check-In",
      description: "Scan QR codes",
      icon: "📱",
      href: "/studio/checkin",
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      id: "5",
      title: "Bookings",
      description: "View all bookings",
      icon: "📋",
      href: "/studio/bookings",
      color: "text-teal-600",
      bgColor: "bg-teal-50 hover:bg-teal-100",
    },
    {
      id: "6",
      title: "Promotions",
      description: "Create offers",
      icon: "🎉",
      href: "/studio/promotions",
      color: "text-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-600">Common tasks and shortcuts</p>
      </div>

      {/* Actions Grid */}
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${action.bgColor}`}
          >
            <span className="text-2xl">{action.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${action.color}`}>
                {action.title}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {action.description}
              </p>
            </div>
            <HiOutlineChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Emergency Actions */}
      <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
        <button className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100">
          <span>🚨</span>
          <span>Emergency Stop Check-Ins</span>
        </button>
        <button className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100">
          <span>📢</span>
          <span>Send Announcement</span>
        </button>
      </div>
    </div>
  );
}
