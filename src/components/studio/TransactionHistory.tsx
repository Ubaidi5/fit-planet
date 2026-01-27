"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  userName: string;
  passType: string;
  amount: number;
  paymentMethod: "card" | "bank" | "wallet" | "cash";
  status: "completed" | "refunded" | "pending" | "failed";
}

export default function TransactionHistory() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions: Transaction[] = [
    {
      id: "TXN-2601-8821",
      date: "2026-01-27",
      userName: "Ahmed Khan",
      passType: "Month Pass",
      amount: 5000,
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "TXN-2601-8820",
      date: "2026-01-27",
      userName: "Sara Ali",
      passType: "Week Pass",
      amount: 2000,
      paymentMethod: "wallet",
      status: "completed",
    },
    {
      id: "TXN-2601-8819",
      date: "2026-01-26",
      userName: "Hassan Raza",
      passType: "Day Pass",
      amount: 800,
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "TXN-2601-8818",
      date: "2026-01-26",
      userName: "Fatima Sheikh",
      passType: "Month Pass",
      amount: 5000,
      paymentMethod: "bank",
      status: "completed",
    },
    {
      id: "TXN-2601-8817",
      date: "2026-01-25",
      userName: "Usman Malik",
      passType: "Day Pass",
      amount: 800,
      paymentMethod: "card",
      status: "refunded",
    },
    {
      id: "TXN-2601-8816",
      date: "2026-01-25",
      userName: "Ayesha Ahmed",
      passType: "Week Pass",
      amount: 2000,
      paymentMethod: "wallet",
      status: "completed",
    },
    {
      id: "TXN-2601-8815",
      date: "2026-01-24",
      userName: "Ali Zafar",
      passType: "Month Pass",
      amount: 5000,
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "TXN-2601-8814",
      date: "2026-01-24",
      userName: "Zainab Khan",
      passType: "Day Pass",
      amount: 800,
      paymentMethod: "cash",
      status: "completed",
    },
    {
      id: "TXN-2601-8813",
      date: "2026-01-23",
      userName: "Bilal Ahmed",
      passType: "Week Pass",
      amount: 2000,
      paymentMethod: "card",
      status: "failed",
    },
    {
      id: "TXN-2601-8812",
      date: "2026-01-23",
      userName: "Maria Khan",
      passType: "Day Pass",
      amount: 800,
      paymentMethod: "wallet",
      status: "completed",
    },
  ];

  const filteredTransactions = transactions
    .filter((txn) =>
      filterStatus === "all" ? true : txn.status === filterStatus,
    )
    .filter((txn) =>
      filterPaymentMethod === "all"
        ? true
        : txn.paymentMethod === filterPaymentMethod,
    )
    .filter((txn) =>
      searchQuery
        ? txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.id.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );

  const getStatusBadge = (status: Transaction["status"]) => {
    const badges = {
      completed: {
        label: "✓ Completed",
        color: "bg-emerald-100 text-emerald-800",
      },
      refunded: { label: "↩ Refunded", color: "bg-orange-100 text-orange-800" },
      pending: { label: "⏳ Pending", color: "bg-yellow-100 text-yellow-800" },
      failed: { label: "✗ Failed", color: "bg-red-100 text-red-800" },
    };
    return badges[status];
  };

  const getPaymentMethodIcon = (method: Transaction["paymentMethod"]) => {
    const icons = {
      card: "💳",
      bank: "🏦",
      wallet: "👛",
      cash: "💵",
    };
    return icons[method];
  };

  const getPaymentMethodLabel = (method: Transaction["paymentMethod"]) => {
    const labels = {
      card: "Card",
      bank: "Bank Transfer",
      wallet: "Wallet",
      cash: "Cash",
    };
    return labels[method];
  };

  // Calculate stats
  const stats = {
    total: transactions.reduce((sum, txn) => sum + txn.amount, 0),
    completed: transactions.filter((t) => t.status === "completed").length,
    refunded: transactions.filter((t) => t.status === "refunded").length,
    failed: transactions.filter((t) => t.status === "failed").length,
  };

  // Payment method breakdown
  const paymentMethodBreakdown = [
    {
      method: "card",
      count: transactions.filter((t) => t.paymentMethod === "card").length,
      percentage: 50,
    },
    {
      method: "wallet",
      count: transactions.filter((t) => t.paymentMethod === "wallet").length,
      percentage: 30,
    },
    {
      method: "bank",
      count: transactions.filter((t) => t.paymentMethod === "bank").length,
      percentage: 15,
    },
    {
      method: "cash",
      count: transactions.filter((t) => t.paymentMethod === "cash").length,
      percentage: 5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Total Amount</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            Rs. {(stats.total / 1000).toFixed(1)}K
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats.completed}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Refunded</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">
            {stats.refunded}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Failed</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Payment Method Breakdown
        </h3>

        <div className="space-y-3">
          {paymentMethodBreakdown.map((pm, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-2xl">
                {getPaymentMethodIcon(pm.method)}
              </span>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {getPaymentMethodLabel(pm.method)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pm.count} ({pm.percentage}%)
                  </p>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${pm.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter by Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Filter by Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Payment
            </label>
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Methods</option>
              <option value="card">💳 Card</option>
              <option value="bank">🏦 Bank Transfer</option>
              <option value="wallet">👛 Wallet</option>
              <option value="cash">💵 Cash</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
        </p>

        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-600">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pass Type</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-600">
                    No transactions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {txn.id}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {new Date(txn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {txn.userName}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-gray-900">{txn.passType}</p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getPaymentMethodIcon(txn.paymentMethod)}
                        </span>
                        <span className="text-sm text-gray-900">
                          {getPaymentMethodLabel(txn.paymentMethod)}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-gray-900">
                        Rs. {txn.amount.toLocaleString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          getStatusBadge(txn.status).color,
                        )}
                      >
                        {getStatusBadge(txn.status).label}
                      </span>
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
    </div>
  );
}
