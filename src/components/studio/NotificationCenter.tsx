"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import Textarea from "../ui/Textarea";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "push" | "email" | "sms";
  audience: "all" | "members" | "nearby" | "inactive";
  status: "sent" | "scheduled" | "draft";
  sentDate?: string;
  scheduledDate?: string;
  recipients: number;
  opened: number;
  clicked: number;
}

export default function NotificationCenter() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "push",
    audience: "all",
    scheduledDate: "",
    scheduledTime: "",
  });

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Weekend Flash Sale - 30% Off!",
      message:
        "Don't miss our weekend special! Get 30% off on all day passes. Valid until Sunday midnight.",
      type: "push",
      audience: "nearby",
      status: "sent",
      sentDate: "2026-01-25",
      recipients: 450,
      opened: 312,
      clicked: 128,
    },
    {
      id: "2",
      title: "New Year Fitness Challenge",
      message:
        "Join our 30-day fitness challenge! Special rates for monthly passes. Transform your body this year!",
      type: "email",
      audience: "all",
      status: "sent",
      sentDate: "2026-01-01",
      recipients: 850,
      opened: 680,
      clicked: 245,
    },
    {
      id: "3",
      title: "We Miss You!",
      message:
        "Haven't seen you in a while. Come back and get 20% off your next pass!",
      type: "sms",
      audience: "inactive",
      status: "sent",
      sentDate: "2026-01-20",
      recipients: 125,
      opened: 98,
      clicked: 42,
    },
    {
      id: "4",
      title: "Valentine's Day Special",
      message:
        "Bring your workout buddy! Buy one pass, get one 50% off. Offer valid Feb 1-14.",
      type: "push",
      audience: "members",
      status: "scheduled",
      scheduledDate: "2026-02-01",
      recipients: 580,
      opened: 0,
      clicked: 0,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "push":
        return "📱";
      case "email":
        return "📧";
      case "sms":
        return "💬";
      default:
        return "📢";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "push":
        return "bg-blue-100 text-blue-800";
      case "email":
        return "bg-purple-100 text-purple-800";
      case "sms":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-emerald-100 text-emerald-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendNotification = () => {
    if (!formData.title || !formData.message) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Sending notification:", formData);
    setShowCreateForm(false);
    setFormData({
      title: "",
      message: "",
      type: "push",
      audience: "all",
      scheduledDate: "",
      scheduledTime: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Sent</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
            {notifications.filter((n) => n.status === "sent").length}
          </p>
          <p className="mt-1 text-xs text-gray-600">This month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600 tracking-tight">
            {(
              notifications
                .filter((n) => n.status === "sent")
                .reduce((sum, n) => sum + (n.opened / n.recipients) * 100, 0) /
                notifications.filter((n) => n.status === "sent").length || 0
            ).toFixed(1)}
            %
          </p>
          <p className="mt-1 text-xs text-emerald-600">↑ 5% vs last month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Avg. Click Rate</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600 tracking-tight">
            {(
              notifications
                .filter((n) => n.status === "sent")
                .reduce((sum, n) => sum + (n.clicked / n.recipients) * 100, 0) /
                notifications.filter((n) => n.status === "sent").length || 0
            ).toFixed(1)}
            %
          </p>
          <p className="mt-1 text-xs text-gray-600">Campaign engagement</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Scheduled</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
            {notifications.filter((n) => n.status === "scheduled").length}
          </p>
          <p className="mt-1 text-xs text-gray-600">Upcoming campaigns</p>
        </div>
      </div>

      {/* Create Notification */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : " Create Notification"}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Create Notification
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notification Type *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "push" }))
                  }
                  className={cn(
                    "flex items-center justify-center space-x-2 rounded-lg border-2 p-4 transition-colors",
                    formData.type === "push"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-sm text-gray-900 font-medium">
                    Push
                  </span>
                </button>

                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "email" }))
                  }
                  className={cn(
                    "flex items-center justify-center space-x-2 rounded-lg border-2 p-4 transition-colors",
                    formData.type === "email"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="text-2xl">📧</span>
                  <span className="text-sm text-gray-900 font-medium">
                    Email
                  </span>
                </button>

                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "sms" }))
                  }
                  className={cn(
                    "flex items-center justify-center space-x-2 rounded-lg border-2 p-4 transition-colors",
                    formData.type === "sms"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="text-2xl">💬</span>
                  <span className="text-sm text-gray-900 font-medium">SMS</span>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <Input
                type="text"
                placeholder="e.g., Weekend Special Offer"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message *
              </label>
              <Textarea
                rows={4}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
              />
              <p className="mt-1 text-xs text-gray-600">
                {formData.message.length}/160 characters
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Target Audience *
              </label>
              <select
                value={formData.audience}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, audience: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Users (~850)</option>
                <option value="members">Members Only (~580)</option>
                <option value="nearby">Users Nearby (~450)</option>
                <option value="inactive">Inactive Members (~125)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Schedule Date (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Schedule Time (Optional)
                </label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledTime: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              {formData.scheduledDate ? "Schedule" : "Send Now"}
            </Button>
          </div>
        </div>
      )}

      {/* Notification History */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-3xl border-2 border-gray-900/[0.06] bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <span className="text-4xl">
                  {getTypeIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        getTypeColor(notification.type),
                      )}
                    >
                      {notification.type.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                        getStatusColor(notification.status),
                      )}
                    >
                      {notification.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {notification.message}
                  </p>

                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
                    <span>Audience: {notification.audience}</span>
                    <span>•</span>
                    <span>{notification.recipients} recipients</span>
                    {notification.sentDate && (
                      <>
                        <span>•</span>
                        <span>
                          Sent:{" "}
                          {new Date(notification.sentDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                    {notification.scheduledDate && (
                      <>
                        <span>•</span>
                        <span>
                          Scheduled:{" "}
                          {new Date(
                            notification.scheduledDate,
                          ).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {notification.status === "sent" && (
                <div className="text-end">
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            {notification.status === "sent" && (
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-600">Delivered</p>
                  <p className="mt-1 text-2xl font-semibold text-ink tracking-tight">
                    {notification.recipients}
                  </p>
                  <p className="text-xs text-gray-500">100%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Opened</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-600 tracking-tight">
                    {notification.opened}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(
                      (notification.opened / notification.recipients) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Clicked</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-600 tracking-tight">
                    {notification.clicked}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(
                      (notification.clicked / notification.recipients) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
