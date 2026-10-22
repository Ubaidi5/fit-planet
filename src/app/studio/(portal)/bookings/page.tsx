import type { Metadata } from "next";
import { Suspense } from "react";
import { requireOwner } from "@/server/session";
import { listGymBookings, type OwnerBookingFilter } from "@/server/modules/bookings";
import { PageHeader } from "@/components/studio/PageHeader";
import { BookingsTable } from "@/components/studio/BookingsTable";
import { isPassType } from "@/lib/passes";

export const metadata: Metadata = { title: "Bookings" };

const STATUSES = ["active", "upcoming", "past", "cancelled", "all"] as const;

export default async function StudioBookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { gyms } = await requireOwner("/studio/bookings");
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status) ?? "all";
  const filter: OwnerBookingFilter = {
    gymIds: gyms.map((g) => g._id),
    status: status as OwnerBookingFilter["status"],
    passType: isPassType(params.pass) ? params.pass : undefined,
    q: params.q?.slice(0, 60) || undefined,
    limit: 300,
  };
  const bookings = await listGymBookings(filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow="Members" title="Bookings" description={`${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"} shown`} />
      <Suspense>
        <BookingsTable bookings={bookings} focusId={params.focus} />
      </Suspense>
    </div>
  );
}
