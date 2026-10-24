import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { adminGyms, type GymFilter } from "@/server/modules/admin";
import { moderateGymAction } from "@/actions/admin";
import { ActionButton, Empty, FilterLinks, PageTitle, Pill, SearchBar } from "@/components/admin/bits";

export const metadata: Metadata = { title: "Gyms" };

const filters: { key: GymFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unverified", label: "Live, unverified" },
  { key: "published", label: "Live" },
  { key: "draft", label: "Drafts" },
  { key: "suspended", label: "Suspended" },
];

export default async function AdminGymsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const filter = (filters.find((f) => f.key === params.status)?.key ?? "all") as GymFilter;
  const q = (params.q ?? "").slice(0, 80);
  const rows = await adminGyms(filter, q);
  const href = (status: string) => `/admin/gyms?status=${status}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageTitle title="Gyms" text="Verify real gyms, feature the best ones, and suspend listings that break the rules." />
      <SearchBar q={q} placeholder="Search name, city or slug">
        {filter !== "all" && <input type="hidden" name="status" value={filter} />}
      </SearchBar>
      <FilterLinks items={filters.map((f) => ({ key: f.key, label: f.label, href: href(f.key) }))} active={filter} />

      {rows.length === 0 ? (
        <Empty>No gyms match.</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ gym, owner }) => {
            const id = gym._id.toHexString();
            return (
              <li key={id} className="rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/gyms/${gym.slug}`} target="_blank" className="truncate text-[15px] font-semibold text-ink hover:underline">
                        {gym.name}
                      </Link>
                      <Pill tone={gym.status === "published" ? "green" : gym.status === "suspended" ? "red" : "gray"}>
                        {gym.status === "published" ? "Live" : gym.status === "suspended" ? "Suspended" : "Draft"}
                      </Pill>
                      {gym.isVerified && <Pill tone="blue">Verified</Pill>}
                      {gym.isFeatured && <Pill tone="amber">Featured</Pill>}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {[gym.address.area, gym.address.city, gym.country].filter(Boolean).join(", ")} · {gym.images.length} photos · {gym.totalReviews} reviews
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      Owner: {owner?.name ?? "Unknown"} {owner?.email && <span className="text-gray-400">({owner.email})</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gym.status !== "suspended" && (
                      <ActionButton action={moderateGymAction} fields={{ gymId: id, action: gym.isVerified ? "unverify" : "verify" }} tone={gym.isVerified ? "default" : "primary"}>
                        {gym.isVerified ? "Unverify" : "Verify"}
                      </ActionButton>
                    )}
                    {gym.status === "published" && (
                      <ActionButton action={moderateGymAction} fields={{ gymId: id, action: gym.isFeatured ? "unfeature" : "feature" }}>
                        {gym.isFeatured ? "Unfeature" : "Feature"}
                      </ActionButton>
                    )}
                    {gym.status === "suspended" ? (
                      <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "restore" }}>
                        Restore as draft
                      </ActionButton>
                    ) : (
                      <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "suspend" }} tone="danger">
                        Suspend
                      </ActionButton>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
