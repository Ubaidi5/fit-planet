"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyReviewAction } from "@/actions/studio";
import { useToast } from "@/components/notifications/ToastProvider";

export function ReviewReply({ reviewId, existing }: { reviewId: string; existing?: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="h-9 cursor-pointer rounded-full px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
        {existing ? "Edit reply" : "Reply publicly"}
      </button>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={1000}
        autoFocus
        placeholder="Thank them, or explain what you're doing about it. Everyone can see this."
        className="block w-full rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="h-9 cursor-pointer rounded-full px-3 text-sm font-medium text-gray-600 hover:bg-gray-900/5">
          Cancel
        </button>
        <button
          type="button"
          disabled={pending || text.trim().length < 2}
          onClick={() =>
            startTransition(async () => {
              const result = await replyReviewAction(reviewId, text);
              if (result.ok) {
                toast.success("Reply posted");
                setOpen(false);
                router.refresh();
              } else toast.error("Couldn't post reply", result.error);
            })
          }
          className="h-9 cursor-pointer rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          {pending ? "Posting..." : "Post reply"}
        </button>
      </div>
    </div>
  );
}
