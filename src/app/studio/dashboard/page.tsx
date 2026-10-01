"use client";

import Link from "next/link";
import RevenueChart from "@/components/studio/RevenueChart";
import RecentBookings from "@/components/studio/RecentBookings";
import QuickActions from "@/components/studio/QuickActions";
import CapacityOverview from "@/components/studio/CapacityOverview";
import { PageHeader } from "@/components/studio/PageHeader";
import { StatCard } from "@/components/studio/StatCard";
import { studioDashboardStats, studioGym } from "@/lib/data/mock-studio";
import {
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineQrCode,
  HiOutlineTicket,
  HiOutlineUserGroup,
} from "react-icons/hi2";

const statIcons: Record<string, React.ReactNode> = {
  checkins: <HiOutlineCheckCircle className="size-4.5" />,
  passes: <HiOutlineTicket className="size-4.5" />,
  revenue: <HiOutlineBanknotes className="size-4.5" />,
  capacity: <HiOutlineUserGroup className="size-4.5" />,
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudioDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow={`${greeting()}, ${studioGym.owner}`}
        title="Dashboard"
        description={`Here is how ${studioGym.name} is doing today.`}
        actions={
          <>
            <Link
              href="/studio/bookings"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <HiOutlineQrCode className="size-4.5 text-volt" />
              Check in member
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studioDashboardStats.map((stat, index) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            deltaLabel={stat.deltaLabel}
            trend={stat.trend}
            spark={stat.spark}
            icon={statIcons[stat.key]}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 70}ms` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <RevenueChart />
          <RecentBookings />
        </div>
        <div className="min-w-0 space-y-6">
          <QuickActions />
          <CapacityOverview />
        </div>
      </div>
    </div>
  );
}
