"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NotificationBadge } from "./NotificationBadge";
import { cn } from "@/lib/utils";
import { HiOutlineBell } from "react-icons/hi";

interface Notification {
  id: string;
  type:
    | "booking"
    | "pass_expiry"
    | "friend"
    | "achievement"
    | "promo"
    | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationBellProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

export function NotificationBell({
  className,
  iconSize = "md",
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "pass_expiry",
      title: "Pass Expiring Soon",
      message: "Your FitZone Premium pass expires in 3 days",
      time: "2h ago",
      read: false,
      actionUrl: "/app/passes",
    },
    {
      id: "2",
      type: "friend",
      title: "New Follower",
      message: "Ali Hassan started following you",
      time: "5h ago",
      read: false,
      actionUrl: "/app/social/buddies",
    },
    {
      id: "3",
      type: "achievement",
      title: "Badge Earned! 🏆",
      message: 'You earned the "30 Day Streak" badge',
      time: "1d ago",
      read: true,
      actionUrl: "/app/profile",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
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

  const getNotificationColor = (type: Notification["type"]) => {
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

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <HiOutlineBell className={cn(iconSizes[iconSize])} />
        <NotificationBadge count={unreadCount} size={iconSize} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🔔
                </div>
                <p className="text-sm text-gray-600">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "border-b border-gray-100 p-4 transition-colors hover:bg-gray-50",
                    !notification.read && "bg-emerald-50/50",
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg",
                        getNotificationColor(notification.type),
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            onClick={() => {
                              markAsRead(notification.id);
                              setIsOpen(false);
                            }}
                          >
                            <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                              View
                            </button>
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            <Link href="/app/notifications" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" fullWidth size="sm">
                View All Notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
