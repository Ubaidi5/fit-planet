"use client";

import { useState, useTransition } from "react";
import { loadMoreFeedAction } from "@/actions/social";
import type { PostView } from "@/lib/types";
import type { WeightUnit } from "@/lib/routines";
import { PostCard } from "./PostCard";

export function FeedList({ initial, mode, unit, empty }: { initial: PostView[]; mode?: "following" | "discover"; unit: WeightUnit; empty: React.ReactNode }) {
  const [posts, setPosts] = useState(initial);
  const [done, setDone] = useState(initial.length < 20 || !mode);
  const [pending, startTransition] = useTransition();

  // A server refresh (new post, follow) hands us a new first page
  const [seen, setSeen] = useState(initial);
  if (seen !== initial) {
    setSeen(initial);
    setPosts(initial);
    setDone(initial.length < 20 || !mode);
  }

  const more = () =>
    startTransition(async () => {
      const last = posts.at(-1);
      if (!last || !mode) return;
      const result = await loadMoreFeedAction(mode, last.createdAt);
      if (!result.ok) return;
      setPosts((list) => [...list, ...result.data.filter((p) => !list.some((x) => x.id === p.id))]);
      if (result.data.length < 20) setDone(true);
    });

  if (posts.length === 0) return <>{empty}</>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} unit={unit} onDeleted={(id) => setPosts((list) => list.filter((p) => p.id !== id))} />
      ))}
      {!done && (
        <button
          type="button"
          onClick={more}
          disabled={pending}
          className="h-12 w-full cursor-pointer rounded-full border border-gray-900/10 text-sm font-semibold text-ink hover:bg-surface disabled:opacity-60"
        >
          {pending ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
