import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { adminUsers } from "@/server/modules/admin";
import { setUserSuspendedAction } from "@/actions/admin";
import { ActionButton, Empty, FilterLinks, PageTitle, Pill, SearchBar } from "@/components/admin/bits";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q ?? "").slice(0, 80);
  const suspendedOnly = params.filter === "suspended";
  const users = await adminUsers(q, suspendedOnly);
  const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
  const href = (filter: string) => `/admin/users?filter=${filter}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageTitle title="Users" text="Find an account, open it for the full picture, and suspend it if needed. Suspending signs it out everywhere." />
      <SearchBar q={q} placeholder="Search email, name or @handle">
        {suspendedOnly && <input type="hidden" name="filter" value="suspended" />}
      </SearchBar>
      <FilterLinks
        items={[
          { key: "all", label: "Newest", href: href("all") },
          { key: "suspended", label: "Suspended", href: href("suspended") },
        ]}
        active={suspendedOnly ? "suspended" : "all"}
      />

      {users.length === 0 ? (
        <Empty>No accounts match.</Empty>
      ) : (
        <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.5rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
          {users.map((u) => {
            const id = u._id.toHexString();
            const self = u._id.equals(admin._id);
            return (
              <li key={id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/users/${id}`} className="truncate text-[15px] font-semibold text-ink hover:underline">
                      {u.name || "No name"}
                    </Link>
                    {u.handle && <span className="text-sm text-gray-500">@{u.handle}</span>}
                    {u.roles?.includes("owner") && <Pill tone="blue">Owner</Pill>}
                    {u.roles?.includes("admin") && <Pill tone="amber">Admin</Pill>}
                    {u.suspendedAt && <Pill tone="red">Suspended</Pill>}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {u.email ?? "No email"} · joined {u.createdAt ? date.format(u.createdAt) : "unknown"}
                    {u.regionCode ? ` · ${u.regionCode}` : ""}
                  </p>
                </div>
                {!self &&
                  (u.suspendedAt ? (
                    <ActionButton action={setUserSuspendedAction} fields={{ userId: id, suspend: "false" }}>
                      Restore
                    </ActionButton>
                  ) : (
                    <ActionButton action={setUserSuspendedAction} fields={{ userId: id, suspend: "true" }} tone="danger">
                      Suspend
                    </ActionButton>
                  ))}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
