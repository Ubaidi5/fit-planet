"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Select from "../ui/Select";
import { Input } from "../ui/Input";

interface Booking {
  id: string;
  bookingDate: string;
  customerName: string;
  phone: string;
  passType: string;
  amount: number;
  paymentMethod: "card" | "cash" | "online";
  status: "confirmed" | "checked-in" | "completed" | "cancelled" | "expired";
  checkInTime?: string;
  checkOutTime?: string;
}

export default function BookingHistory() {
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("week");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const bookings: Booking[] = [
    {
      id: "BK-2026-001",
      bookingDate: "2026-01-27",
      customerName: "Ahmed Khan",
      phone: "+92 300 1234567",
      passType: "Day Pass",
      amount: 500,
      paymentMethod: "online",
      status: "checked-in",
      checkInTime: "08:30 AM",
    },
    {
      id: "BK-2026-002",
      bookingDate: "2026-01-27",
      customerName: "Sara Ali",
      phone: "+92 321 9876543",
      passType: "Monthly Pass",
      amount: 3500,
      paymentMethod: "card",
      status: "confirmed",
    },
    {
      id: "BK-2026-003",
      bookingDate: "2026-01-27",
      customerName: "Hamza Malik",
      phone: "+92 333 4567890",
      passType: "Weekly Pass",
      amount: 1200,
      paymentMethod: "online",
      status: "checked-in",
      checkInTime: "10:00 AM",
    },
    {
      id: "BK-2026-004",
      bookingDate: "2026-01-26",
      customerName: "Fatima Sheikh",
      phone: "+92 345 2345678",
      passType: "Day Pass",
      amount: 500,
      paymentMethod: "cash",
      status: "completed",
      checkInTime: "07:45 AM",
      checkOutTime: "10:30 AM",
    },
    {
      id: "BK-2026-005",
      bookingDate: "2026-01-26",
      customerName: "Usman Ahmed",
      phone: "+92 312 8765432",
      passType: "Monthly Pass",
      amount: 3500,
      paymentMethod: "online",
      status: "confirmed",
    },
    {
      id: "BK-2026-006",
      bookingDate: "2026-01-25",
      customerName: "Ayesha Raza",
      phone: "+92 301 5556789",
      passType: "Day Pass",
      amount: 500,
      paymentMethod: "card",
      status: "completed",
      checkInTime: "08:00 AM",
      checkOutTime: "11:15 AM",
    },
    {
      id: "BK-2026-007",
      bookingDate: "2026-01-25",
      customerName: "Ali Hassan",
      phone: "+92 322 7778888",
      passType: "Weekly Pass",
      amount: 1200,
      paymentMethod: "online",
      status: "cancelled",
    },
    {
      id: "BK-2026-008",
      bookingDate: "2026-01-24",
      customerName: "Zainab Khan",
      phone: "+92 313 9990000",
      passType: "Day Pass",
      amount: 500,
      paymentMethod: "cash",
      status: "expired",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    // Apply status filter
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.customerName.toLowerCase().includes(query) ||
        booking.phone.includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-emerald-100 text-emerald-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "💳";
      case "cash":
        return "💵";
      case "online":
        return "🌐";
      default:
        return "💰";
    }
  };

  const handleExport = () => {
    // In production, generate CSV/Excel file
    alert("Exporting bookings to CSV...");
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
          <p className="mt-2 text-3xl font-semibold text-ink tracking-tight">1,248</p>
          <p className="mt-1 text-xs text-emerald-600">↑ 15% this month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600 tracking-tight">Rs. 2.8M</p>
          <p className="mt-1 text-xs text-gray-600">This month</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Active Passes</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600 tracking-tight">128</p>
          <p className="mt-1 text-xs text-gray-600">Currently valid</p>
        </div>

        <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-4 shadow-soft">
          <p className="text-sm font-medium text-gray-600">Cancellation Rate</p>
          <p className="mt-2 text-3xl font-semibold text-orange-600 tracking-tight">2.4%</p>
          <p className="mt-1 text-xs text-emerald-600">↓ 0.5% vs last month</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Date Range */}
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange("today")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                dateRange === "today"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("week")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                dateRange === "week"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange("month")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                dateRange === "month"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                dateRange === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              All Time
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2 gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </Select>

            <Button fullWidth variant="outline" onClick={handleExport}>
              📥 Export
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Search by name, phone, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl border border-gray-900/[0.06] bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-start text-xs font-medium text-gray-600">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pass Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {booking.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.bookingDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-500">{booking.phone}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.passType}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Rs. {booking.amount.toLocaleString()}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getPaymentMethodIcon(booking.paymentMethod)}
                        </span>
                        <span className="text-xs capitalize text-gray-600">
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
                          getStatusColor(booking.status),
                        )}
                      >
                        {booking.status.replace("-", " ")}
                      </span>
                      {booking.checkInTime && (
                        <p className="mt-1 text-xs text-gray-500">
                          In: {booking.checkInTime}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      </div>
    </div>
  );
}
