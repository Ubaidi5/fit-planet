"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FeedbackCollection() {
  const [selectedPromptType, setSelectedPromptType] = useState<
    "post-visit" | "ongoing" | "campaign"
  >("post-visit");
  const [promptSettings, setPromptSettings] = useState({
    enabled: true,
    timing: "24hours",
    incentive: "enabled",
    incentiveType: "discount",
  });

  // Sample feedback requests
  const feedbackRequests = [
    {
      id: "1",
      userName: "Ahmed Khan",
      lastVisit: "2026-01-26",
      status: "pending",
      sentDate: "2026-01-27",
      method: "push",
    },
    {
      id: "2",
      userName: "Sara Ali",
      lastVisit: "2026-01-25",
      status: "completed",
      sentDate: "2026-01-26",
      method: "email",
      rating: 5,
    },
    {
      id: "3",
      userName: "Hassan Raza",
      lastVisit: "2026-01-25",
      status: "pending",
      sentDate: "2026-01-26",
      method: "sms",
    },
    {
      id: "4",
      userName: "Fatima Sheikh",
      lastVisit: "2026-01-24",
      status: "completed",
      sentDate: "2026-01-25",
      method: "push",
      rating: 4,
    },
    {
      id: "5",
      userName: "Usman Malik",
      lastVisit: "2026-01-23",
      status: "ignored",
      sentDate: "2026-01-24",
      method: "email",
    },
  ];

  const stats = {
    sent: 145,
    completed: 87,
    pending: 42,
    responseRate: 60,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Requests Sent</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.sent}</p>
          <p className="mt-1 text-xs text-gray-600">This month</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {stats.completed}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Reviews received</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {stats.pending}
          </p>
          <p className="mt-1 text-xs text-gray-600">Awaiting response</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Response Rate</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.responseRate}%
          </p>
          <p className="mt-1 text-xs text-blue-600">↑ 5% vs last month</p>
        </div>
      </div>

      {/* Prompt Configuration */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Feedback Prompt Settings
          </h3>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Automatic Feedback Requests
                </p>
                <p className="text-sm text-gray-600">
                  Send review requests after visits
                </p>
              </div>
              <button
                onClick={() =>
                  setPromptSettings((prev) => ({
                    ...prev,
                    enabled: !prev.enabled,
                  }))
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  promptSettings.enabled ? "bg-emerald-600" : "bg-gray-300",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    promptSettings.enabled ? "left-5" : "left-0.5",
                  )}
                />
              </button>
            </div>

            {/* Timing */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Send Request After
              </label>
              <select
                value={promptSettings.timing}
                onChange={(e) =>
                  setPromptSettings((prev) => ({
                    ...prev,
                    timing: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="immediate">Immediately after checkout</option>
                <option value="4hours">4 hours after visit</option>
                <option value="24hours">24 hours after visit</option>
                <option value="48hours">48 hours after visit</option>
                <option value="1week">1 week after visit</option>
              </select>
            </div>

            {/* Incentive Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Offer Incentive</p>
                <p className="text-sm text-gray-600">
                  Reward members for leaving reviews
                </p>
              </div>
              <button
                onClick={() =>
                  setPromptSettings((prev) => ({
                    ...prev,
                    incentive:
                      prev.incentive === "enabled" ? "disabled" : "enabled",
                  }))
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  promptSettings.incentive === "enabled"
                    ? "bg-emerald-600"
                    : "bg-gray-300",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    promptSettings.incentive === "enabled"
                      ? "left-5"
                      : "left-0.5",
                  )}
                />
              </button>
            </div>

            {/* Incentive Type */}
            {promptSettings.incentive === "enabled" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Incentive Type
                </label>
                <select
                  value={promptSettings.incentiveType}
                  onChange={(e) =>
                    setPromptSettings((prev) => ({
                      ...prev,
                      incentiveType: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="discount">10% off next visit</option>
                  <option value="freeclass">Free group class</option>
                  <option value="credits">Rs. 100 credit</option>
                  <option value="merchandise">Free gym merchandise</option>
                </select>
              </div>
            )}

            {/* Save Button */}
            <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700">
              Save Settings
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          {/* Prompt Types */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Prompt Types
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedPromptType("post-visit")}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selectedPromptType === "post-visit"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">
                  📱 Post-Visit Prompt
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Automatic request after each visit
                </p>
              </button>

              <button
                onClick={() => setSelectedPromptType("ongoing")}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selectedPromptType === "ongoing"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">💬 In-App Prompt</p>
                <p className="mt-1 text-sm text-gray-600">
                  Show rating dialog in mobile app
                </p>
              </button>

              <button
                onClick={() => setSelectedPromptType("campaign")}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-all",
                  selectedPromptType === "campaign"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300",
                )}
              >
                <p className="font-semibold text-gray-900">📧 Email Campaign</p>
                <p className="mt-1 text-sm text-gray-600">
                  Bulk request to active members
                </p>
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Message Preview
            </h3>

            <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
              {selectedPromptType === "post-visit" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    🌟 How was your workout at FitZone?
                  </p>
                  <p className="text-sm text-gray-700">
                    Hey Ahmed! Thanks for visiting us today. We'd love to hear
                    about your experience.
                  </p>
                  <div className="flex items-center justify-center space-x-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-2xl text-gray-300">
                        ⭐
                      </span>
                    ))}
                  </div>
                  {promptSettings.incentive === "enabled" && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-xs font-semibold text-emerald-900">
                        🎁 Leave a review and get{" "}
                        {promptSettings.incentiveType === "discount" &&
                          "10% off your next visit"}
                        {promptSettings.incentiveType === "freeclass" &&
                          "a free group class"}
                        {promptSettings.incentiveType === "credits" &&
                          "Rs. 100 credit"}
                        {promptSettings.incentiveType === "merchandise" &&
                          "free gym merchandise"}
                        !
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedPromptType === "ongoing" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    💪 Loving FitZone?
                  </p>
                  <p className="text-sm text-gray-700">
                    You've completed 10 workouts! Help others discover us by
                    leaving a review.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                      Rate Now
                    </button>
                    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
                      Later
                    </button>
                  </div>
                </div>
              )}

              {selectedPromptType === "campaign" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Subject: We Value Your Feedback! 🌟
                  </p>
                  <p className="text-sm text-gray-700">
                    Hi Ahmed,
                    <br />
                    <br />
                    As a valued member of FitZone, your opinion matters to us.
                    Please take a moment to share your experience and help us
                    continue improving.
                    <br />
                    <br />
                    [Leave a Review Button]
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Feedback Requests
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-600">
                <th className="p-4">Member</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Sent Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbackRequests.map((request) => (
                <tr
                  key={request.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-900">
                      {request.userName}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-sm text-gray-900">
                      {new Date(request.lastVisit).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="text-sm text-gray-900">
                      {new Date(request.sentDate).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        request.method === "push" &&
                          "bg-blue-100 text-blue-800",
                        request.method === "email" &&
                          "bg-purple-100 text-purple-800",
                        request.method === "sms" &&
                          "bg-green-100 text-green-800",
                      )}
                    >
                      {request.method === "push" && "📱 Push"}
                      {request.method === "email" && "📧 Email"}
                      {request.method === "sms" && "💬 SMS"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        request.status === "completed" &&
                          "bg-emerald-100 text-emerald-800",
                        request.status === "pending" &&
                          "bg-orange-100 text-orange-800",
                        request.status === "ignored" &&
                          "bg-gray-100 text-gray-800",
                      )}
                    >
                      {request.status === "completed" && "✓ Completed"}
                      {request.status === "pending" && "⏳ Pending"}
                      {request.status === "ignored" && "✗ No Response"}
                    </span>
                  </td>

                  <td className="p-4">
                    {request.rating ? (
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold text-gray-900">
                          {request.rating}
                        </span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  <td className="p-4">
                    {request.status === "pending" && (
                      <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        Resend
                      </button>
                    )}
                    {request.status === "completed" && (
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="mb-3 text-sm font-semibold text-blue-900">
          💡 Best Practices for Feedback Collection
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="text-sm text-blue-700">
            <strong>✓ Timing:</strong> Send requests 24-48 hours after visit for
            best response rate
          </div>
          <div className="text-sm text-blue-700">
            <strong>✓ Incentives:</strong> Small rewards (10-15% discount) can
            double response rates
          </div>
          <div className="text-sm text-blue-700">
            <strong>✓ Personalization:</strong> Use member's name and mention
            specific visits
          </div>
          <div className="text-sm text-blue-700">
            <strong>✓ Follow-up:</strong> Send gentle reminders to
            non-responders after 3-4 days
          </div>
        </div>
      </div>
    </div>
  );
}
