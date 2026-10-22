"use client";

import { useState } from "react";
import ReviewMonitoring from "@/components/studio/ReviewMonitoring";
import ResponseSystem from "@/components/studio/ResponseSystem";
import RatingAnalytics from "@/components/studio/RatingAnalytics";
import FeedbackCollection from "@/components/studio/FeedbackCollection";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<
    "monitoring" | "responses" | "analytics" | "feedback"
  >("monitoring");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-surface p-6 shadow-soft">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Reviews & Reputation
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor reviews, respond to feedback, and track your gym's
            reputation
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Rating
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">4.7</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">From 248 reviews</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Reviews</p>
                <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">12</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
            <p className="mt-2 text-xs text-emerald-600">↑ 8 this week</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Rate
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">92%</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">227 of 248 responded</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Replies
                </p>
                <p className="mt-2 text-3xl font-semibold text-orange-600 tracking-tight">5</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
            <p className="mt-2 text-xs text-orange-600">Needs your attention</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-3xl border border-gray-900/[0.06] bg-surface shadow-soft">
          <nav
            className="flex space-x-8 border-b border-gray-200 px-6"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "monitoring"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Review Monitoring
            </button>

            <button
              onClick={() => setActiveTab("responses")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "responses"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Response System
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "analytics"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Rating Analytics
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "feedback"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Feedback Collection
            </button>
          </nav>

          {/* Tab Content */}
          <div className="bg-gray-50 p-6">
            {activeTab === "monitoring" && <ReviewMonitoring />}
            {activeTab === "responses" && <ResponseSystem />}
            {activeTab === "analytics" && <RatingAnalytics />}
            {activeTab === "feedback" && <FeedbackCollection />}
          </div>
        </div>
      </div>
    </div>
  );
}
