import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/server/session";
import { reportQueue } from "@/server/modules/admin";
import { resolveReportAction, setUserSuspendedAction } from "@/actions/admin";
import { ActionButton, Empty, PageTitle, Pill } from "@/components/admin/bits";

export const metadata: Metadata = { title: "Reports" };

const kindLabel = { text: "Post", workout: "Workout", checkin: "Check-in", routine: "Routine" } as const;

export default async function AdminReportsPage() {
  await requireAdmin();
  const queue = await reportQueue();
  const time = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <PageTitle title="Reports" text="Posts members flagged, most reported first. Removing a post tells its author why." />
      {queue.length === 0 ? (
        <Empty>No open reports.</Empty>
      ) : (
        <ul className="space-y-3">
          {queue.map((item) => {
            const postId = item.postId.toHexString();
            return (
              <li key={postId} className="rounded-[1.5rem] bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Pill tone={item.count >= 3 ? "red" : "amber"}>
                    {item.count} {item.count === 1 ? "report" : "reports"}
                  </Pill>
                  {item.post && <Pill>{kindLabel[item.post.kind]}</Pill>}
                  <span className="text-xs text-gray-500">Last {time.format(item.last)}</span>
                </div>

                {item.post ? (
                  <div className="mt-3 flex gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">
                        {item.author?.handle ? (
                          <Link href={`/app/u/${item.author.handle}`} target="_blank" className="font-semibold text-ink hover:underline">
                            {item.author.name ?? `@${item.author.handle}`}
                          </Link>
                        ) : (
                          <span className="font-semibold text-ink">{item.author?.name ?? "Unknown"}</span>
                        )}
                        {item.author?.suspendedAt && <span className="ml-2 text-xs font-semibold text-red-700">Suspended</span>}
                      </p>
                      {item.post.text && <p className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-line text-ink">{item.post.text}</p>}
                      {item.post.checkin && <p className="mt-1.5 text-sm text-gray-600">Checked in at {item.post.checkin.gymName}</p>}
                      {item.post.workout && <p className="mt-1.5 text-sm text-gray-600">Workout: {item.post.workout.routineName}</p>}
                      {item.post.routine && <p className="mt-1.5 text-sm text-gray-600">Routine: {item.post.routine.name}</p>}
                    </div>
                    {item.post.imageUrl && (
                      <img src={item.post.imageUrl} alt="" className="size-20 shrink-0 rounded-2xl object-cover ring-1 ring-gray-900/[0.06] sm:size-28" />
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">The post has already been deleted.</p>
                )}

                {item.reasons.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {item.reasons.map((r) => (
                      <li key={r} className="rounded-full bg-canvas px-3 py-1 text-xs text-gray-600">
                        {r}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-900/[0.06] pt-4">
                  {item.post && (
                    <ActionButton action={resolveReportAction} fields={{ postId, action: "remove" }} tone="danger">
                      Remove post
                    </ActionButton>
                  )}
                  <ActionButton action={resolveReportAction} fields={{ postId, action: "dismiss" }}>
                    {item.post ? "Keep post" : "Clear"}
                  </ActionButton>
                  {item.author && !item.author.suspendedAt && (
                    <ActionButton action={setUserSuspendedAction} fields={{ userId: item.author._id.toHexString(), suspend: "true", note: "From a report" }}>
                      Suspend author
                    </ActionButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
