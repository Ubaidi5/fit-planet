"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  passType: "Day Pass" | "Week Pass" | "Monthly" | "Yearly";
  amount: number;
  status: "confirmed" | "checked-in" | "expired" | "cancelled";
  bookingDate: string;
  checkInTime?: string;
}

export default function RecentBookings() {
  const bookings: Booking[] = [
    {
      id: "B001",
      customerName: "Ahmed Khan",
      phone: "+92 300 1234567",
      passType: "Day Pass",
      amount: 500,
      status: "checked-in",
      bookingDate: "2026-01-27",
      checkInTime: "08:30 AM",
    },
    {
      id: "B002",
      customerName: "Sara Ali",
      phone: "+92 321 9876543",
      passType: "Monthly",
      amount: 3500,
      status: "confirmed",
      bookingDate: "2026-01-27",
    },
    {
      id: "B003",
      customerName: "Hamza Malik",
      phone: "+92 333 4567890",
      passType: "Week Pass",
      amount: 1200,
      status: "checked-in",
      bookingDate: "2026-01-27",
      checkInTime: "09:15 AM",
    },
    {
      id: "B004",
      customerName: "Fatima Sheikh",
      phone: "+92 345 2345678",
      passType: "Day Pass",
      amount: 500,
      status: "confirmed",
      bookingDate: "2026-01-27",
    },
    {
      id: "B005",
      customerName: "Usman Ahmed",
      phone: "+92 312 8765432",
      passType: "Monthly",
      amount: 3500,
      status: "checked-in",
      bookingDate: "2026-01-26",
      checkInTime: "07:45 AM",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-emerald-100 text-emerald-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "checked-in":
        return "Checked In";
      case "expired":
        return "Expired";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPassTypeColor = (passType: string) => {
    switch (passType) {
      case "Day Pass":
        return "bg-purple-100 text-purple-800";
      case "Week Pass":
        return "bg-blue-100 text-blue-800";
      case "Monthly":
        return "bg-emerald-100 text-emerald-800";
      case "Yearly":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-3xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Latest customer bookings and check-ins
          </p>
        </div>
        <Link
          href="/studio/bookings"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View All →
        </Link>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-start text-xs font-medium text-gray-600">
              <th className="pb-3">Booking ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Pass Type</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="py-4">
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {booking.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </td>

                <td className="py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.customerName}
                  </p>
                  <p className="text-xs text-gray-500">{booking.phone}</p>
                </td>

                <td className="py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      getPassTypeColor(booking.passType),
                    )}
                  >
                    {booking.passType}
                  </span>
                </td>

                <td className="py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Rs. {booking.amount.toLocaleString()}
                  </p>
                </td>

                <td className="py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      getStatusColor(booking.status),
                    )}
                  >
                    {getStatusLabel(booking.status)}
                  </span>
                  {booking.checkInTime && (
                    <p className="mt-1 text-xs text-gray-500">
                      {booking.checkInTime}
                    </p>
                  )}
                </td>

                <td className="py-4">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          Showing {bookings.length} of {bookings.length} bookings
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600">
              {bookings.filter((b) => b.status === "checked-in").length} Checked
              In
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-600">
              {bookings.filter((b) => b.status === "confirmed").length}{" "}
              Confirmed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
