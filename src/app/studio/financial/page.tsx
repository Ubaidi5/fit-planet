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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Reports & Revenue
          </h1>
          <p className="mt-2 text-gray-600">
            Track revenue, manage payouts, and generate financial reports
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  Rs. 485K
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="mt-2 text-xs text-emerald-600">↑ 15% this month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Payout
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  Rs. 125K
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">Processing in 3 days</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transactions
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">324</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <p className="mt-2 text-xs text-emerald-600">↑ 28 this week</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Transaction
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  Rs. 1.5K
                </p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
            <p className="mt-2 text-xs text-gray-600">Per booking</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
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
