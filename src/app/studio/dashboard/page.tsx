"use client";

import Link from "next/link";

// Placeholder dashboard - will be fully implemented in Module 9
export default function StudioDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Fit Planet Studio
        </h1>
        <p className="mt-2 text-gray-600">
          Your gym management dashboard is coming soon.
        </p>

        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-sm text-gray-500">Today&apos;s Check-ins</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-sm text-gray-500">Active Passes</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">Rs. 0</p>
            <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">0/50</p>
            <p className="text-sm text-gray-500">Current Capacity</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/studio/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Sign In to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Back to Website
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Full dashboard coming in Module 9
        </p>
      </div>
    </div>
  );
}
