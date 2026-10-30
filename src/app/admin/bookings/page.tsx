import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { adminBookings, type BookingFilter } from "@/server/modules/admin";
import { Empty, FilterLinks, PageTitle, SearchBar } from "@/components/admin/bits";
import { BookingRow } from "@/components/admin/BookingRow";

export const metadata: Metadata = { title: "Bookings" };

const filters: { key: BookingFilter; label: string }[] = [
  { key: "all", label: "Newest" },
  { key: "paid", label: "Paid" },
  { key: "desk", label: "Unpaid at desk" },
  { key: "refunded", label: "Refunded" },
  { key: "cancelled", label: "Cancelled" },
  { key: "failed", label: "Payment failed" },
];

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const filter = filters.find((f) => f.key === params.filter)?.key ?? "all";
  const q = (params.q ?? "").slice(0, 80);
  const rows = await adminBookings(filter, q);
  const href = (key: string) => `/admin/bookings?filter=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageTitle title="Bookings" text="Every pass across all gyms. Refund an online payment or cancel a pass when a member or gym asks for help." />
      <SearchBar q={q} placeholder="Search pass code, guest or payment id">
        {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
      </SearchBar>
      <FilterLinks items={filters.map((f) => ({ key: f.key, label: f.label, href: href(f.key) }))} active={filter} />

      {rows.length === 0 ? (
        <Empty>No bookings match.</Empty>
      ) : (
        <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.5rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
          {rows.map(({ booking, gymName }) => (
            <BookingRow key={booking._id.toHexString()} booking={booking} gymName={gymName} show="both" />
          ))}
        </ul>
      )}
    </>
  );
}
