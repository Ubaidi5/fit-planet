"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiChatBubbleOvalLeft,
  HiEllipsisHorizontal,
  HiHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineFlag,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiPaperAirplane,
} from "react-icons/hi2";
import { addCommentAction, commentsAction, deleteCommentAction, deletePostAction, reportPostAction, saveRoutineFromPostAction, toggleLikeAction } from "@/actions/social";
import { useToast } from "@/components/notifications/ToastProvider";
import { Stamp } from "@/components/passport/Stamp";
import { Avatar } from "./Avatar";
import { exerciseById } from "@/lib/data/exercises";
import { cityCode } from "@/lib/data/cities";
import { categoryLabel, kgToUnit, targetLabel, type WeightUnit } from "@/lib/routines";
import { timeAgo } from "@/lib/time-ago";
import type { CommentView, PostView } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  post: PostView;
  unit: WeightUnit;
  /** Server-loaded thread: the single post page opens comments straight away */
  initialComments?: CommentView[];
  onDeleted?: (id: string) => void;
}

export function PostCard({ post, unit, initialComments, onDeleted }: Props) {
  const toast = useToast();
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [comments, setComments] = useState<CommentView[] | null>(initialComments ?? null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const showComments = initialComments !== undefined || open;

  const like = () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    startTransition(async () => {
      const result = await toggleLikeAction(post.id);
      if (result.ok) {
        setLiked(result.data.liked);
        setLikes(result.data.likeCount);
      } else {
        setLiked(!next);
        setLikes((n) => n + (next ? -1 : 1));
      }
    });
  };

  const toggleComments = () => {
    setOpen((o) => !o);
    if (comments === null) {
      startTransition(async () => {
        const result = await commentsAction(post.id);
        setComments(result.ok ? result.data : []);
      });
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    startTransition(async () => {
      const result = await addCommentAction(post.id, text);
      if (result.ok) {
        setComments(result.data);
        setCommentCount(result.data.length);
        setDraft("");
      } else toast.error("Couldn't comment", result.error);
    });
  };

  const removeComment = (id: string) =>
    startTransition(async () => {
      const result = await deleteCommentAction(id);
      if (result.ok) {
        setComments((list) => list?.filter((c) => c.id !== id) ?? null);
        setCommentCount((n) => Math.max(0, n - 1));
      }
    });

  const remove = () =>
    startTransition(async () => {
      const result = await deletePostAction(post.id);
      setMenu(false);
      if (!result.ok) return toast.error("Couldn't delete", result.error);
      toast.success("Post deleted");
      if (onDeleted) onDeleted(post.id);
      else router.push("/app/social");
    });

  const report = () =>
    startTransition(async () => {
      const result = await reportPostAction(post.id, "Reported from feed");
      setMenu(false);
      if (result.ok) toast.success(result.message ?? "Reported");
    });

  const saveRoutine = () =>
    startTransition(async () => {
      const result = await saveRoutineFromPostAction(post.id);
      if (result.ok) {
        toast.success(result.message ?? "Saved");
        router.push(`/app/routines/${result.data.routineId}/edit`);
      } else toast.error("Couldn't save", result.error);
    });

  const profile = post.author.handle ? `/app/u/${post.author.handle}` : "#";

  return (
    <article className="rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
      <header className="flex items-center gap-3 px-4 pt-4 sm:px-5">
        <Link href={profile} className="shrink-0">
          <Avatar name={post.author.name} image={post.author.image} initials={post.author.initials} />
        </Link>
        <div className="min-w-0 flex-1 leading-tight">
          <Link href={profile} className="block truncate text-sm font-semibold text-ink hover:underline">
            {post.author.name}
          </Link>
          <p className="flex items-center gap-1 truncate text-xs text-gray-500">
            {post.author.handle && <span className="truncate">@{post.author.handle}</span>}
            <span aria-hidden>·</span>
            <Link href={`/app/social/post/${post.id}`} className="shrink-0 hover:underline">
              <time dateTime={post.createdAt} suppressHydrationWarning>
                {timeAgo(post.createdAt)}
              </time>
            </Link>
            {post.visibility === "followers" && <HiOutlineLockClosed className="size-3 shrink-0" aria-label="Followers only" />}
          </p>
        </div>
        <div className="relative -me-2">
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label="Post options"
            aria-expanded={menu}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-900/5 hover:text-ink"
          >
            <HiEllipsisHorizontal className="size-5" />
          </button>
          {menu && (
            <>
              <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-30 cursor-default" onClick={() => setMenu(false)} />
              <div className="absolute end-0 top-10 z-40 w-44 rounded-2xl border border-gray-900/[0.06] bg-surface p-1.5 shadow-lift">
                {post.mine ? (
                  <button type="button" onClick={remove} className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-stamp-magenta hover:bg-canvas">
                    <HiOutlineTrash className="size-4.5" />
                    Delete post
                  </button>
                ) : (
                  <button type="button" onClick={report} className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-canvas">
                    <HiOutlineFlag className="size-4.5 text-gray-400" />
                    Report
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {post.text && <p className="px-4 pt-3 text-[15px] leading-relaxed whitespace-pre-line text-gray-800 sm:px-5">{post.text}</p>}

      <div className="px-4 pt-3 sm:px-5">
        {post.imageUrl && <img src={post.imageUrl} alt="" className="max-h-[32rem] w-full rounded-2xl bg-canvas object-cover" />}

        {post.workout && (
          <Link href={post.mine ? `/app/routines/history/${post.workout.id}` : `/app/social/post/${post.id}`} className="block rounded-2xl bg-ink p-4 text-white">
            <p className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">Workout logged</p>
            <p className="mt-1 text-lg font-semibold tracking-tight">{post.workout.routineName}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-dashed border-white/15 pt-3">
              {[
                ["Time", `${post.workout.durationMin}`, "min"],
                ["Sets", `${post.workout.setsDone}`, ""],
                ["Volume", new Intl.NumberFormat("en").format(kgToUnit(post.workout.volumeKg, unit)), unit],
              ].map(([label, value, suffix]) => (
                <div key={label}>
                  <dt className="text-[11px] text-white/50">{label}</dt>
                  <dd className="text-lg font-semibold text-volt tabular-nums">
                    {value}
                    {suffix && <span className="ms-0.5 text-xs font-normal text-white/50">{suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            {post.workout.exerciseIds.length > 0 && (
              <p className="mt-3 truncate text-xs text-white/60">
                {post.workout.exerciseIds
                  .map((id) => exerciseById.get(id)?.name)
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </Link>
        )}

        {post.checkin && (
          <Link href={`/gyms/${post.checkin.gymSlug}`} className="flex items-center gap-4 rounded-2xl bg-[linear-gradient(var(--color-volt-soft),var(--color-surface))] p-4 ring-1 ring-gray-900/[0.05]">
            <Stamp code={cityCode(post.checkin.city)} label={post.checkin.city} tone="teal" shape="circle" rotate={-8} size="sm" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">Checked in</p>
              <p className="truncate font-semibold text-ink">{post.checkin.gymName}</p>
              <p className="text-sm text-gray-500">{post.checkin.city}</p>
            </div>
          </Link>
        )}

        {post.routine && (
          <div className="rounded-2xl bg-canvas p-4">
            <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">Routine · {categoryLabel(post.routine.category)}</p>
            <p className="mt-1 font-semibold text-ink">{post.routine.name}</p>
            <ol className="mt-2 space-y-1 text-sm text-gray-600">
              {post.routine.items.slice(0, 6).map((item, i) => (
                <li key={`${item.exerciseId}-${i}`} className="flex justify-between gap-3">
                  <span className="truncate">{exerciseById.get(item.exerciseId)?.name}</span>
                  <span className="shrink-0 text-gray-400 tabular-nums">
                    {item.sets} × {targetLabel(item)}
                  </span>
                </li>
              ))}
              {post.routine.items.length > 6 && <li className="text-gray-400">+{post.routine.items.length - 6} more</li>}
            </ol>
            {!post.mine && (
              <button type="button" onClick={saveRoutine} disabled={pending} className="mt-3 h-10 w-full cursor-pointer rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-60">
                Save to my routines
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="flex items-center gap-1 px-2 pt-2 pb-2 sm:px-3">
        <button
          type="button"
          onClick={like}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-gray-600 hover:bg-gray-900/5"
        >
          {liked ? <HiHeart className="size-5 text-stamp-magenta" /> : <HiOutlineHeart className="size-5" />}
          <span className="tabular-nums">{likes > 0 ? likes : ""}</span>
        </button>
        <button
          type="button"
          onClick={toggleComments}
          aria-expanded={showComments}
          aria-label="Comments"
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-gray-600 hover:bg-gray-900/5"
        >
          {showComments ? <HiChatBubbleOvalLeft className="size-5 text-ink" /> : <HiOutlineChatBubbleOvalLeft className="size-5" />}
          <span className="tabular-nums">{commentCount > 0 ? commentCount : ""}</span>
        </button>
      </footer>

      {showComments && (
        <div className="border-t border-gray-900/[0.06] px-4 pt-3 pb-4 sm:px-5">
          {comments === null ? (
            <div className="h-10 animate-pulse rounded-2xl bg-canvas" />
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="group flex gap-2.5">
                  <Avatar name={c.author.name} image={c.author.image} initials={c.author.initials} size="sm" />
                  <div className="min-w-0 flex-1 rounded-2xl bg-canvas px-3 py-2">
                    <p className="text-xs">
                      <Link href={c.author.handle ? `/app/u/${c.author.handle}` : "#"} className="font-semibold text-ink">
                        {c.author.name}
                      </Link>
                      <span className="ms-1.5 text-gray-400" suppressHydrationWarning>
                        {timeAgo(c.createdAt)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm break-words whitespace-pre-line text-gray-800">{c.text}</p>
                  </div>
                  {(c.mine || post.mine) && (
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      aria-label="Delete comment"
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center self-center rounded-full text-gray-300 hover:text-stamp-magenta sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <HiOutlineTrash className="size-4" />
                    </button>
                  )}
                </li>
              ))}
              {comments.length === 0 && <li className="text-sm text-gray-500">No comments yet. Say something nice.</li>}
            </ul>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex items-center gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              placeholder="Add a comment"
              aria-label="Add a comment"
              className="h-11 min-w-0 flex-1 rounded-full bg-canvas px-4 text-sm text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-ink/10"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              aria-label="Send comment"
              className={cn("flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-30")}
            >
              <HiPaperAirplane className="size-4.5 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
