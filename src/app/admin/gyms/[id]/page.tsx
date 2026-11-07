import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { adminGymDetail } from "@/server/modules/admin";
import { adminUpdateGymAction, deleteGymAction, transferGymAction } from "@/actions/admin";
import { formatMoney } from "@/lib/i18n/format";
import { Empty, Panel, Pill, SuspensionNote } from "@/components/admin/bits";
import { AdminForm, ConfirmForm, Field } from "@/components/admin/AdminForms";
import { BookingRow } from "@/components/admin/BookingRow";
import { GymActions, GymStatusPill } from "@/components/admin/GymActions";
import { History } from "@/components/admin/History";

export const metadata: Metadata = { title: "Gym" };

export default async function AdminGymPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = toObjectId((await params).id);
  const data = id ? await adminGymDetail(id) : null;
  if (!data) notFound();
  const { gym, owner, staff, stats } = data;
  const gymId = gym._id.toHexString();
  const money = (n: number) => formatMoney(n, gym.currency);

  const numbers = [
    { label: "Passes, 30 days", value: String(stats.bookings30) },
    { label: "Paid, 30 days", value: money(stats.paid30) },
    { label: "Check-ins, 30 days", value: String(stats.checkins30) },
    { label: "Paid, all time", value: money(stats.paid), hint: `${stats.bookings} passes` },
  ];

  return (
    <>
      <Link href="/admin/gyms" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-ink">
        <span aria-hidden>←</span> Gyms
      </Link>

      <Panel>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-3xl">{gym.name}</h1>
              <GymStatusPill status={gym.status} />
              {gym.isVerified && <Pill tone="blue">Verified</Pill>}
              {gym.isFeatured && <Pill tone="amber">Featured</Pill>}
              {gym.isDemo && <Pill>Sample</Pill>}
            </div>
            <p className="mt-1 text-gray-500">
              {[gym.address.area, gym.address.city, gym.country].filter(Boolean).join(", ")} · {gym.rating.toFixed(1)} from {gym.totalReviews} reviews
            </p>
            <SuspensionNote suspension={gym.suspension} className="mt-2" />
            {gym.status === "published" && (
              <Link href={`/gyms/${gym.slug}`} target="_blank" className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:underline">
                View public page ↗
              </Link>
            )}
          </div>
          <GymActions gym={gym} />
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
            <p className="truncate text-[13px] font-medium text-gray-500">{n.label}</p>
            <p className="mt-1.5 truncate text-2xl font-semibold tracking-[-0.03em] text-ink tabular-nums">{n.value}</p>
            {n.hint && <p className="mt-0.5 text-xs text-gray-500">{n.hint}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <Panel>
          <h2 className="text-lg font-semibold text-ink">Listing details</h2>
          <p className="mt-0.5 text-sm text-gray-500">Fix mistakes for the owner. The web address stays the same.</p>
          <AdminForm action={adminUpdateGymAction} hidden={{ gymId }} submit="Save changes" className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" defaultValue={gym.name} required className="sm:col-span-2" />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-gray-600">Short description</span>
                <textarea
                  name="description"
                  defaultValue={gym.description}
                  rows={3}
                  required
                  minLength={20}
                  maxLength={300}
                  className="w-full resize-y rounded-xl bg-canvas px-3.5 py-3 text-[15px] text-ink ring-1 ring-gray-900/[0.08] outline-none focus:bg-surface focus:ring-2 focus:ring-emerald-500/40"
                />
              </label>
              <Field label="Street" name="street" defaultValue={gym.address.street} required className="sm:col-span-2" />
              <Field label="Area" name="area" defaultValue={gym.address.area} required />
              <Field label="City" name="city" defaultValue={gym.address.city} required />
              <Field label="Phone" name="phone" type="tel" defaultValue={gym.contact?.phone} />
              <Field label="Email" name="email" type="email" defaultValue={gym.contact?.email} />
              <Field label="Website" name="website" type="url" defaultValue={gym.contact?.website} placeholder="https://" />
              <Field label="Capacity" name="capacity" type="number" min={1} max={5000} defaultValue={gym.capacity.max} required />
            </div>
            <fieldset className="mt-6">
              <legend className="text-[13px] font-semibold text-ink">Prices in {gym.currency}</legend>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
                <Field label="Day" name="dayPass" type="number" min={0} step="0.01" defaultValue={gym.pricing.dayPass} required />
                <Field label="Week" name="weekPass" type="number" min={0} step="0.01" defaultValue={gym.pricing.weekPass} required />
                <Field label="Month" name="monthPass" type="number" min={0} step="0.01" defaultValue={gym.pricing.monthPass} required />
              </div>
            </fieldset>
            <Field label="Note for the audit log (optional)" name="note" maxLength={300} className="mt-6" placeholder="Why you changed it" />
          </AdminForm>
        </Panel>

        <div className="space-y-4 lg:space-y-6">
          <Panel>
            <h2 className="text-lg font-semibold text-ink">People</h2>
            <ul className="mt-4 divide-y divide-gray-900/[0.06]">
              {[...(owner ? [{ person: owner, role: "Owner" }] : []), ...staff.map((person) => ({ person, role: "Staff" }))].map(({ person, role }) => (
                <li key={person._id.toHexString()}>
                  <Link href={`/admin/users/${person._id.toHexString()}`} className="group flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-ink group-hover:underline">{person.name || "No name"}</span>
                      <span className="block truncate text-xs text-gray-500">{person.email}</span>
                    </span>
                    <span className="flex shrink-0 gap-1.5">
                      {person.suspendedAt && <Pill tone="red">Suspended</Pill>}
                      <Pill tone={role === "Owner" ? "blue" : "gray"}>{role}</Pill>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {!owner && <p className="mt-3 text-sm text-gray-500">The owner’s account is gone. Move the gym to someone below.</p>}
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold text-ink">Move to a new owner</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {gym.isDemo ? "Hand this sample studio to a real gym owner. It stops being a sample." : "They need a Fit Planet account. The current owner stays on as staff."}
            </p>
            <AdminForm action={transferGymAction} hidden={{ gymId }} submit="Move gym" className="mt-4">
              <Field label="New owner's email" name="email" type="email" required autoComplete="off" />
            </AdminForm>
          </Panel>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Recent passes</h2>
        {data.recent.length ? (
          <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.5rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
            {data.recent.map((booking) => (
              <BookingRow key={booking._id.toHexString()} booking={booking} gymName={gym.name} show="member" />
            ))}
          </ul>
        ) : (
          <Empty>No passes booked here yet.</Empty>
        )}
      </section>

      <History entries={data.history} />

      <Panel className="ring-red-600/15">
        <h2 className="text-lg font-semibold text-ink">Delete gym</h2>
        <p className="mt-0.5 mb-4 text-sm text-gray-500">
          {gym.isDemo || stats.bookings === 0
            ? "Removes the listing with its reviews and check-ins for good. To take it off the site for now, use Hide from site instead."
            : "This gym has sold passes, so its records stay for members and accounting. Hide or suspend it instead."}
        </p>
        {(gym.isDemo || stats.bookings === 0) && (
          <ConfirmForm action={deleteGymAction} hidden={{ gymId }} label="Delete gym" confirm="Delete for good" warning={`${gym.name} and everything attached to it will be deleted. This can't be undone.`} />
        )}
      </Panel>
    </>
  );
}
