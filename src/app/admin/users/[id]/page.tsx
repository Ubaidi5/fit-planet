import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin, requireAdmin } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { adminUserDetail } from "@/server/modules/admin";
import { setUserAdminAction, setUserSuspendedAction, suspendAction } from "@/actions/admin";
import { env } from "@/server/env";
import { formatMoney } from "@/lib/i18n/format";
import { reasonsFor } from "@/lib/suspension";
import { SuspendForm } from "@/components/admin/AdminForms";
import { ActionButton, Empty, Panel, Pill, SuspensionNote } from "@/components/admin/bits";
import { BookingRow } from "@/components/admin/BookingRow";
import { History } from "@/components/admin/History";

export const metadata: Metadata = { title: "Account" };

const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const id = toObjectId((await params).id);
  const data = id ? await adminUserDetail(id) : null;
  if (!data) notFound();
  const { user, counts } = data;
  const userId = user._id.toHexString();
  const self = user._id.equals(admin._id);
  const viaEnv = Boolean(user.email && env.adminEmails.includes(user.email.toLowerCase()));

  const facts = [
    { label: "Email", value: user.email ?? "None" },
    { label: "Phone", value: user.phone || "None" },
    { label: "Joined", value: user.createdAt ? date.format(user.createdAt) : "Unknown" },
    { label: "Region", value: [user.homeCity, user.regionCode].filter(Boolean).join(", ") || "Not set" },
    { label: "Sign-in", value: user.passwordUnverified ? "Password, email not proven" : user.emailVerified ? "Email verified" : "Email not verified" },
  ];
  const numbers = [
    { label: "Passes", value: data.bookings.length === 20 ? "20+" : String(data.bookings.length) },
    { label: "Workouts", value: String(counts.workouts) },
    { label: "Posts", value: String(counts.posts) },
    { label: "Followers", value: String(counts.followers) },
  ];

  return (
    <>
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-ink">
        <span aria-hidden>←</span> Users
      </Link>

      <Panel>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-3xl">{user.name || "No name"}</h1>
              {user.roles?.includes("owner") && <Pill tone="blue">Owner</Pill>}
              {isAdmin(user) && <Pill tone="amber">Admin</Pill>}
              {user.suspendedAt && <Pill tone="red">Suspended {date.format(user.suspendedAt)}</Pill>}
            </div>
            {user.handle && <p className="mt-1 text-gray-500">@{user.handle}</p>}
          </div>
          {!self && (
            <div className="flex flex-wrap gap-2">
              {!viaEnv && (
                <ActionButton action={setUserAdminAction} fields={{ userId, grant: user.roles?.includes("admin") ? "false" : "true" }}>
                  {user.roles?.includes("admin") ? "Remove admin" : "Make admin"}
                </ActionButton>
              )}
              {user.suspendedAt ? (
                <ActionButton action={setUserSuspendedAction} fields={{ userId }}>
                  Restore account
                </ActionButton>
              ) : (
                <SuspendForm action={suspendAction} target="user" id={userId} reasons={reasonsFor("user")} />
              )}
            </div>
          )}
        </div>
        <SuspensionNote suspension={user.suspension} className="mt-3" />
        {viaEnv && <p className="mt-3 text-sm text-gray-500">Admin through ADMIN_EMAILS on the server, so it can’t be removed here.</p>}

        <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-[13px] font-medium text-gray-500">{f.label}</dt>
              <dd className="mt-0.5 truncate text-[15px] text-ink">{f.value}</dd>
            </div>
          ))}
          <div className="min-w-0">
            <dt className="text-[13px] font-medium text-gray-500">Paid in total</dt>
            <dd className="mt-0.5 truncate text-[15px] text-ink tabular-nums">
              {data.spend.length ? data.spend.map((s) => formatMoney(s.total, s.currency)).join(" · ") : "Nothing yet"}
            </dd>
          </div>
        </dl>
      </Panel>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
            <p className="text-[13px] font-medium text-gray-500">{n.label}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-ink tabular-nums">{n.value}</p>
          </div>
        ))}
      </div>

      {data.gyms.length > 0 && (
        <Panel>
          <h2 className="text-lg font-semibold text-ink">Studios</h2>
          <ul className="mt-4 divide-y divide-gray-900/[0.06]">
            {data.gyms.map(({ gym, role }) => (
              <li key={gym._id.toHexString()}>
                <Link href={`/admin/gyms/${gym._id.toHexString()}`} className="group flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-ink group-hover:underline">{gym.name}</span>
                    <span className="block truncate text-xs text-gray-500">{gym.address.city}</span>
                  </span>
                  <Pill tone={role === "owner" ? "blue" : "gray"}>{role === "owner" ? "Owner" : "Staff"}</Pill>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Recent passes</h2>
        {data.bookings.length ? (
          <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.5rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
            {data.bookings.map(({ booking, gymName }) => (
              <BookingRow key={booking._id.toHexString()} booking={booking} gymName={gymName} show="gym" />
            ))}
          </ul>
        ) : (
          <Empty>No passes booked yet.</Empty>
        )}
      </section>

      <History entries={data.history} />
    </>
  );
}
