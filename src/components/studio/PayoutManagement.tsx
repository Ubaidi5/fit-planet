"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  expectedDate?: string;
  method: "bank" | "wallet";
  transactionId?: string;
}

export default function PayoutManagement() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const payouts: Payout[] = [
    {
      id: "PAY-2026-001",
      date: "2026-01-27",
      amount: 125000,
      status: "pending",
      expectedDate: "2026-01-30",
      method: "bank",
    },
    {
      id: "PAY-2026-002",
      date: "2026-01-20",
      amount: 142000,
      status: "completed",
      method: "bank",
      transactionId: "BNK-8821-2601",
    },
    {
      id: "PAY-2026-003",
      date: "2026-01-13",
      amount: 138000,
      status: "completed",
      method: "bank",
      transactionId: "BNK-8820-2601",
    },
    {
      id: "PAY-2026-004",
      date: "2026-01-06",
      amount: 145000,
      status: "completed",
      method: "bank",
      transactionId: "BNK-8819-2601",
    },
    {
      id: "PAY-2025-052",
      date: "2025-12-30",
      amount: 155000,
      status: "completed",
      method: "bank",
      transactionId: "BNK-8818-1225",
    },
    {
      id: "PAY-2025-051",
      date: "2025-12-23",
      amount: 148000,
      status: "completed",
      method: "bank",
      transactionId: "BNK-8817-1225",
    },
  ];

  const filteredPayouts = payouts.filter((payout) =>
    filterStatus === "all" ? true : payout.status === filterStatus,
  );

  const getStatusBadge = (status: Payout["status"]) => {
    const badges = {
      pending: { label: "⏳ Pending", color: "bg-yellow-100 text-yellow-800" },
      processing: {
        label: "🔄 Processing",
        color: "bg-blue-100 text-blue-800",
      },
      completed: {
        label: "✓ Completed",
        color: "bg-emerald-100 text-emerald-800",
      },
      failed: { label: "✗ Failed", color: "bg-red-100 text-red-800" },
    };
    return badges[status];
  };

  // Calculate stats
  const stats = {
    pending: payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
    completed: payouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    total: payouts.reduce((sum, p) => sum + p.amount, 0),
    count: payouts.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Pending Payout</p>
          <p className="mt-2 text-3xl font-semibold text-orange-600 tracking-tight">
            Rs. {(stats.pending / 1000).toFixed(0)}K
          </p>
          <p className="mt-1 text-xs text-gray-600">Processing in 3 days</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Paid Out</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600 tracking-tight">
            Rs. {(stats.completed / 1000).toFixed(0)}K
          </p>
          <p className="mt-1 text-xs text-emerald-600">This month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Payout Count</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">{stats.count}</p>
          <p className="mt-1 text-xs text-gray-600">Successful payouts</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Avg. Payout</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600 tracking-tight">
            Rs. {(stats.completed / stats.count / 1000).toFixed(0)}K
          </p>
          <p className="mt-1 text-xs text-gray-600">Per transaction</p>
        </div>
      </div>

      {/* Payout Schedule */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Payout Schedule
        </h3>

        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <span className="text-2xl">📅</span>
            </div>

            <div className="flex-1">
              <p className="font-semibold text-blue-900">
                Next Payout: January 30, 2026
              </p>
              <p className="mt-1 text-sm text-blue-700">
                Amount: Rs. 125,000 • Method: Bank Transfer
              </p>
              <p className="mt-2 text-xs text-blue-600">
                💡 Payouts are processed weekly on Thursdays. Funds typically
                arrive within 2-3 business days.
              </p>
            </div>

            <div className="text-end">
              <p className="text-2xl font-semibold text-blue-900 tracking-tight">3 Days</p>
              <p className="text-xs text-blue-700">Until payout</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-600">
              Payout Frequency
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">Weekly</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-600">Payout Day</p>
            <p className="mt-1 text-lg font-bold text-gray-900">Thursday</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-600">Bank Account</p>
            <p className="mt-1 text-lg font-bold text-gray-900">****1234</p>
          </div>
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Payouts</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button className="rounded-full border border-gray-200 bg-surface px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Download Statement
          </button>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
            Update Bank Details
          </button>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface shadow-soft">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Payout History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-start text-xs font-medium text-gray-600">
                <th className="p-4">Payout ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expected Date</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-600">
                    No payouts found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {payout.id}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {new Date(payout.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-lg font-bold text-gray-900">
                        Rs. {(payout.amount / 1000).toFixed(0)}K
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {payout.method === "bank" ? "🏦" : "👛"}
                        </span>
                        <span className="text-sm text-gray-900">
                          {payout.method === "bank"
                            ? "Bank Transfer"
                            : "Wallet"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          getStatusBadge(payout.status).color,
                        )}
                      >
                        {getStatusBadge(payout.status).label}
                      </span>
                    </td>

                    <td className="p-4">
                      {payout.expectedDate ? (
                        <p className="text-sm text-gray-900">
                          {new Date(payout.expectedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-4">
                      {payout.transactionId ? (
                        <p className="font-mono text-xs text-gray-600">
                          {payout.transactionId}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-4">
                      <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Account Info */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Bank Account Details
        </h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">Bank Name</p>
                <p className="mt-1 font-semibold text-gray-900">Meezan Bank</p>
              </div>
              <span className="text-2xl">🏦</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Account Number
                </p>
                <p className="mt-1 font-mono font-semibold text-gray-900">
                  ****-****-1234
                </p>
              </div>
              <span className="text-2xl">💳</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  Account Title
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  FitZone Gym & Fitness
                </p>
              </div>
              <span className="text-2xl">👤</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">IBAN</p>
                <p className="mt-1 font-mono text-sm font-semibold text-gray-900">
                  PK12MEZN****1234
                </p>
              </div>
              <span className="text-2xl">🔢</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
