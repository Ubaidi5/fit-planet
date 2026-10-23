import Link from "next/link";
import { requireAdmin } from "@/server/session";
import { adminOverview } from "@/server/modules/admin";
import { formatMoney } from "@/lib/i18n/format";
import { PageTitle, Panel } from "@/components/admin/bits";

const actionLabels: Record<string, string> = {
  "gym.verify": "verified a gym",
  "gym.unverify": "removed a gym's verification",
  "gym.feature": "featured a gym",
  "gym.unfeature": "unfeatured a gym",
  "gym.suspend": "suspended a gym",
  "gym.restore": "restored a gym",
  "report.remove": "removed a reported post",
  "report.dismiss": "dismissed a report",
  "user.suspend": "suspended an account",
  "user.restore": "restored an account",
};

export default async function AdminOverviewPage() {
  await requireAdmin();
  const data = await adminOverview();
  const time = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

  const stats = [
    { label: "Members", value: data.users.toLocaleString("en"), hint: `${data.newUsers} new in 30 days`, href: "/admin/users" },
    { label: "Live gyms", value: data.gyms.published.toLocaleString("en"), hint: `${data.gyms.draft} drafts, ${data.gyms.suspended} suspended`, href: "/admin/gyms" },
    { label: "Passes sold", value: data.bookings.toLocaleString("en"), hint: "Last 30 days", href: "/admin/gyms" },
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
