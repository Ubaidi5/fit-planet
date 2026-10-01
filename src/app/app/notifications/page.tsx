"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineCheck, HiOutlineTrash, HiOutlineCog } from "react-icons/hi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Notification types
type NotificationType =
  | "booking"
  | "pass_expiry"
  | "friend"
  | "achievement"
  | "promo"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    gymName?: string;
    friendName?: string;
    badgeName?: string;
    discount?: string;
  };
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "pass_expiry",
    title: "Pass Expiring Soon",
    message:
      "Your FitZone Premium monthly pass expires in 3 days. Renew now to keep your streak!",
    time: "2 hours ago",
    read: false,
    actionUrl: "/app/passes",
    actionText: "Renew Pass",
    metadata: { gymName: "FitZone Premium" },
  },
  {
    id: "2",
    type: "friend",
    title: "New Follower",
    message:
      "Ali Hassan started following you. Check out their workout routines!",
    time: "5 hours ago",
    read: false,
    actionUrl: "/app/social/buddies",
    actionText: "View Profile",
    metadata: { friendName: "Ali Hassan" },
  },
  {
    id: "3",
    type: "achievement",
    title: "Badge Earned! 🏆",
    message:
      'Congratulations! You earned the "30 Day Streak" badge for your consistency!',
    time: "1 day ago",
    read: true,
    actionUrl: "/app/profile",
    actionText: "View Badge",
    metadata: { badgeName: "30 Day Streak" },
  },
  {
    id: "4",
    type: "booking",
    title: "Booking Confirmed",
    message:
      "Your day pass at Iron Paradise for today has been confirmed. Show QR at entry.",
    time: "1 day ago",
    read: true,
    actionUrl: "/app/passes",
    actionText: "Show QR",
    metadata: { gymName: "Iron Paradise" },
  },
  {
    id: "5",
    type: "promo",
    title: "Special Offer! 🎉",
    message:
      "FitZone Premium is offering 20% off on monthly passes this weekend only!",
    time: "2 days ago",
    read: true,
    actionUrl: "/gyms/fitzone-premium",
    actionText: "View Offer",
    metadata: { gymName: "FitZone Premium", discount: "20%" },
  },
  {
    id: "6",
    type: "friend",
    title: "Workout Buddy Request",
    message:
      "Fatima Khan wants to be your workout buddy. Accept to coordinate gym visits!",
    time: "2 days ago",
    read: true,
    actionUrl: "/app/social/buddies",
    actionText: "Respond",
    metadata: { friendName: "Fatima Khan" },
  },
  {
    id: "7",
    type: "system",
    title: "Profile Update",
    message: "Your phone number has been successfully verified.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "8",
    type: "achievement",
    title: "New Personal Record! 💪",
    message: "You set a new PR on Bench Press: 80kg! Keep pushing!",
    time: "4 days ago",
    read: true,
    actionUrl: "/app/dashboard",
    actionText: "View Progress",
  },
  {
    id: "9",
    type: "promo",
    title: "Free Trial Available",
    message: "Muscle Factory is offering a free trial day. Try it out!",
    time: "5 days ago",
    read: true,
    actionUrl: "/gyms/muscle-factory",
    actionText: "Claim Free Trial",
    metadata: { gymName: "Muscle Factory" },
  },
  {
    id: "10",
    type: "booking",
    title: "Check-in Successful",
    message: "You checked in at FitZone Premium. Have a great workout!",
    time: "1 week ago",
    read: true,
    metadata: { gymName: "FitZone Premium" },
  },
];

type FilterType = "all" | NotificationType;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || n.type === filter,
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "booking":
        return "📋";
      case "pass_expiry":
        return "⏰";
      case "friend":
        return "👤";
      case "achievement":
        return "🏆";
      case "promo":
        return "🏷️";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "booking":
        return "bg-blue-100";
      case "pass_expiry":
        return "bg-amber-100";
      case "friend":
        return "bg-purple-100";
      case "achievement":
        return "bg-emerald-100";
      case "promo":
        return "bg-pink-100";
      case "system":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  const filters = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "booking",
      label: "Bookings",
      count: notifications.filter((n) => n.type === "booking").length,
    },
    {
      key: "pass_expiry",
      label: "Passes",
      count: notifications.filter((n) => n.type === "pass_expiry").length,
    },
    {
      key: "friend",
      label: "Friends",
      count: notifications.filter((n) => n.type === "friend").length,
    },
    {
      key: "achievement",
      label: "Achievements",
      count: notifications.filter((n) => n.type === "achievement").length,
    },
    {
      key: "promo",
      label: "Offers",
      count: notifications.filter((n) => n.type === "promo").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl tracking-tight">
            Notifications
          </h1>
          <p className="mt-1 text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              beforeIcon={<HiOutlineCheck className="h-4 w-4" />}
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={clearAll}
              beforeIcon={<HiOutlineTrash className="h-4 w-4" />}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as FilterType)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                filter === f.key ? "bg-white/20" : "bg-gray-200",
              )}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <HiOutlineCog className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Notification Settings</p>
              <p className="text-sm text-gray-500">
                Manage what notifications you receive
              </p>
            </div>
          </div>
          <Link href="/app/profile#notifications">
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </Link>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
            🔔
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No notifications
          </h3>
          <p className="mt-1 text-gray-500">
            {filter === "all"
              ? "You're all caught up!"
              : `No ${filter.replace("_", " ")} notifications`}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "overflow-hidden transition-all",
                !notification.read && "border-emerald-200 bg-emerald-50/50",
              )}
            >
              <div className="flex gap-4 p-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl",
                    getNotificationColor(notification.type),
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-500"></span>
                    )}
                  </div>

                  {/* Meta & Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                    {notification.actionUrl && notification.actionText && (
                      <Link href={notification.actionUrl}>
                        <Button
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          {notification.actionText}
                        </Button>
                      </Link>
                    )}
                    {!notification.read && (
                      <Button onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
