import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { adminGyms, type GymFilter } from "@/server/modules/admin";
import { Empty, FilterLinks, PageTitle, Pill, SearchBar, SuspensionNote } from "@/components/admin/bits";
import { ConfirmForm } from "@/components/admin/AdminForms";
import { deleteDemoGymsAction } from "@/actions/admin";
import { GymActions, GymStatusPill } from "@/components/admin/GymActions";

export const metadata: Metadata = { title: "Gyms" };

const filters: { key: GymFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unverified", label: "Live, unverified" },
  { key: "published", label: "Live" },
  { key: "draft", label: "Hidden" },
  { key: "suspended", label: "Suspended" },
  { key: "demo", label: "Sample studios" },
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
      <PageTitle title="Gyms" text="Verify real gyms, feature the best ones, hide or suspend listings that break the rules." />
      <SearchBar q={q} placeholder="Search name, city or slug">
        {filter !== "all" && <input type="hidden" name="status" value={filter} />}
      </SearchBar>
      <FilterLinks items={filters.map((f) => ({ key: f.key, label: f.label, href: href(f.key) }))} active={filter} />
      {filter === "demo" && rows.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-sm text-gray-600">Sample studios fill the site before real gyms join. Hide them one by one, or remove them all when you are ready.</p>
          <ConfirmForm
            action={deleteDemoGymsAction}
            label="Remove all samples"
            confirm={`Delete ${rows.length} studios`}
            warning="This deletes every sample studio with its reviews and bookings. It can't be undone."
          />
        </div>
      )}

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
                      <Link href={`/admin/gyms/${id}`} className="truncate text-[15px] font-semibold text-ink hover:underline">
                        {gym.name}
                      </Link>
                      <GymStatusPill status={gym.status} />
                      {gym.isVerified && <Pill tone="blue">Verified</Pill>}
                      {gym.isFeatured && <Pill tone="amber">Featured</Pill>}
                      {gym.isDemo && <Pill>Sample</Pill>}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {[gym.address.area, gym.address.city, gym.country].filter(Boolean).join(", ")} · {gym.images.length} photos · {gym.totalReviews} reviews
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      Owner: {gym.isDemo ? "Sample data" : (owner?.name ?? "Unknown")} {owner?.email && <span className="text-gray-400">({owner.email})</span>}
                    </p>
                    <SuspensionNote suspension={gym.suspension} className="mt-0.5 truncate" />
                  </div>
                  <GymActions gym={gym} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
