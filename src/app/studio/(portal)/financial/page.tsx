"use client";

import { useState } from "react";
import RevenueDashboard from "@/components/studio/RevenueDashboard";
import TransactionHistory from "@/components/studio/TransactionHistory";
import PayoutManagement from "@/components/studio/PayoutManagement";
import FinancialReports from "@/components/studio/FinancialReports";

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<
    "revenue" | "transactions" | "payouts" | "reports"
  >("revenue");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-surface p-6 shadow-soft">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Financial Reports & Revenue
          </h1>
          <p className="mt-2 text-gray-600">
            Track revenue, manage payouts, and generate financial reports
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">
                  Rs. 485K
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="mt-2 text-xs text-emerald-600">↑ 15% this month</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Payout
                </p>
                <p className="mt-2 text-3xl font-semibold text-orange-600 tracking-tight">
                  Rs. 125K
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">Processing in 3 days</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transactions
                </p>
                <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">324</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <p className="mt-2 text-xs text-emerald-600">↑ 28 this week</p>
          </div>

          <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Transaction
                </p>
                <p className="mt-2 text-3xl font-semibold text-blue-600 tracking-tight">
                  Rs. 1.5K
                </p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">Per booking</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-3xl border border-gray-900/[0.06] bg-surface shadow-soft">
          <nav
            className="flex space-x-8 border-b border-gray-200 px-6"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("revenue")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "revenue"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Revenue Dashboard
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "transactions"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Transaction History
            </button>

            <button
              onClick={() => setActiveTab("payouts")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "payouts"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Payout Management
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "reports"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Financial Reports
            </button>
          </nav>

          {/* Tab Content */}
          <div className="bg-gray-50 p-6">
            {activeTab === "revenue" && <RevenueDashboard />}
            {activeTab === "transactions" && <TransactionHistory />}
            {activeTab === "payouts" && <PayoutManagement />}
            {activeTab === "reports" && <FinancialReports />}
          </div>
        </div>
      </div>
    </div>
  );
}
