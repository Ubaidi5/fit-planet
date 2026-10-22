import type { Metadata } from "next";
import { HiCheckBadge, HiStar } from "react-icons/hi2";
import { requireOwner } from "@/server/session";
import { listGymReviews } from "@/server/modules/reviews";
import { PageHeader } from "@/components/studio/PageHeader";
import { ReviewReply } from "@/components/studio/ReviewReply";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Reviews" };

const categories = [
  ["cleanliness", "Cleanliness"],
  ["equipment", "Equipment"],
  ["staff", "Staff"],
  ["value", "Value"],
] as const;

export default async function StudioReviewsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { gym, gyms } = await requireOwner("/studio/reviews");
  const { filter } = await searchParams;
  const all = await listGymReviews(gyms.map((g) => g._id));
  const reviews = filter === "unanswered" ? all.filter((r) => !r.gymResponse) : filter === "low" ? all.filter((r) => r.rating <= 3) : all;
  const unanswered = all.filter((r) => !r.gymResponse).length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({ star, count: all.filter((r) => r.rating === star).length }));
  const breakdown = gym.ratingBreakdown;
  const dateFmt = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow="Reputation" title="Reviews" description={unanswered > 0 ? `${unanswered} waiting for a reply` : "Every review has a reply. Nice."} />

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.06]">
            <div className="flex items-end gap-3">
              <p className="text-5xl font-semibold tracking-tight text-ink tabular-nums">{gym.rating ? gym.rating.toFixed(1) : "–"}</p>
              <div className="pb-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <HiStar key={s} className={cn("size-4", s <= Math.round(gym.rating) ? "text-stamp-ochre" : "text-gray-200")} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{gym.totalReviews} reviews</p>
              </div>
            </div>
            <ul className="mt-5 space-y-1.5">
              {distribution.map(({ star, count }) => (
                <li key={star} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3 tabular-nums">{star}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <span className="block h-full rounded-full bg-stamp-ochre" style={{ width: `${all.length ? (count / all.length) * 100 : 0}%` }} />
                  </span>
                  <span className="w-6 text-end tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
            {breakdown && (
              <dl className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-900/[0.06] pt-4">
                {categories.map(([key, label]) => (
                  <div key={key} className="rounded-2xl bg-canvas px-3 py-2">
                    <dt className="text-xs text-gray-500">{label}</dt>
                    <dd className="font-semibold text-ink tabular-nums">{breakdown[key].toFixed(1)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
          <nav className="flex gap-1 lg:flex-col">
            {[
              ["", "All reviews", all.length],
              ["unanswered", "Needs a reply", unanswered],
              ["low", "3 stars or less", all.filter((r) => r.rating <= 3).length],
            ].map(([value, label, count]) => (
              <a
                key={label}
                href={value ? `?filter=${value}` : "?"}
                className={cn(
                  "flex h-10 flex-1 items-center justify-between gap-2 rounded-full px-4 text-sm font-medium lg:flex-none",
                  (filter ?? "") === value ? "bg-ink text-white" : "text-gray-600 hover:bg-gray-900/5",
                )}
              >
                <span className="truncate">{label}</span>
                <span className="tabular-nums opacity-70">{count}</span>
              </a>
            ))}
          </nav>
        </aside>

        <ul className="space-y-3">
          {reviews.length === 0 && <li className="rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-14 text-center text-sm text-gray-500">No reviews here yet.</li>}
          {reviews.map((r) => (
            <li key={r.id} className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.06] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas font-semibold text-ink">{r.userName.charAt(0)}</span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                      {r.userName}
                      {r.isVerified && <HiCheckBadge className="size-4 shrink-0 text-emerald-600" aria-label="Verified visit" />}
                    </p>
                    <p className="text-xs text-gray-500">{dateFmt.format(new Date(r.date))}</p>
                  </div>
                </div>
                <div className="flex shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <HiStar key={s} className={cn("size-4", s <= r.rating ? "text-stamp-ochre" : "text-gray-200")} />
                  ))}
                </div>
              </div>
              <p className="mt-4 font-semibold text-ink">{r.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{r.comment}</p>
              {r.gymResponse && (
                <div className="mt-4 rounded-2xl bg-canvas p-4 text-sm">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">Your reply</p>
                  <p className="mt-1 leading-relaxed text-gray-700">{r.gymResponse.response}</p>
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <ReviewReply reviewId={r.id} existing={r.gymResponse?.response} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
