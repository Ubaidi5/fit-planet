import Link from "next/link";
import { requireAdmin } from "@/server/session";
import { adminGrowth, adminOverview } from "@/server/modules/admin";
import { formatMoney } from "@/lib/i18n/format";
import { PageTitle, Panel } from "@/components/admin/bits";
import { GrowthBars } from "@/components/admin/GrowthBars";
import { actionLabels } from "@/components/admin/labels";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [data, growth] = await Promise.all([adminOverview(), adminGrowth()]);
  const time = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

  const stats = [
    { label: "Members", value: data.users.toLocaleString("en"), hint: `${data.newUsers} new in 30 days`, href: "/admin/users" },
    { label: "Live gyms", value: data.gyms.published.toLocaleString("en"), hint: `${data.gyms.draft} drafts, ${data.gyms.suspended} suspended`, href: "/admin/gyms" },
    { label: "Passes sold", value: data.bookings.toLocaleString("en"), hint: "Last 30 days", href: "/admin/bookings" },
    { label: "Open reports", value: data.openReports.toLocaleString("en"), hint: data.openReports ? "Needs a look" : "All clear", href: "/admin/reports" },
  ];

  return (
    <>
      <PageTitle title="Overview" text="The platform at a glance." />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] transition-shadow hover:shadow-lift sm:p-6">
            <p className="text-[13px] font-medium text-gray-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-3xl">{s.value}</p>
            <p className="mt-1 truncate text-xs text-gray-500">{s.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <Panel>
          <h2 className="text-lg font-semibold text-ink">Growth, 30 days</h2>
          <p className="mt-0.5 text-sm text-gray-500">New accounts and passes sold each day (UTC).</p>
          <div className="mt-5">
            <GrowthBars series={growth.series} />
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold text-ink">Busiest gyms</h2>
          <p className="mt-0.5 text-sm text-gray-500">By passes sold in the last 30 days.</p>
          {growth.topGyms.length ? (
            <ol className="mt-4 divide-y divide-gray-900/[0.06]">
              {growth.topGyms.map((g, i) => (
                <li key={g.id}>
                  <Link href={`/admin/gyms/${g.id}`} className="group flex items-center gap-3 py-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-canvas font-mono text-xs text-gray-500 ring-1 ring-gray-900/[0.06]">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-ink group-hover:underline">{g.name}</span>
                      <span className="block truncate text-xs text-gray-500">{g.city}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">{g.passes}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No passes sold yet.</p>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:gap-6">
        <Panel>
          <h2 className="text-lg font-semibold text-ink">Paid online, 30 days</h2>
          {data.revenue.length ? (
            <ul className="mt-4 divide-y divide-gray-900/[0.06]">
              {data.revenue.map((r) => (
                <li key={r.currency} className="flex items-center justify-between py-3 text-[15px]">
                  <span className="font-mono text-xs text-gray-500">{r.currency}</span>
                  <span className="font-semibold text-ink tabular-nums">{formatMoney(r.total, r.currency)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No online payments yet.</p>
          )}
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold text-ink">Recent admin activity</h2>
          {data.recent.length ? (
            <ul className="mt-4 divide-y divide-gray-900/[0.06]">
              {data.recent.map((r) => (
                <li key={r._id.toHexString()} className="flex flex-col gap-0.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="text-ink">
                    <span className="font-semibold">{r.adminName}</span> {actionLabels[r.action] ?? r.action}
                    {r.note && <span className="text-gray-500"> · {r.note}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500">{time.format(r.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">Nothing yet. Every moderation step is recorded here.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
