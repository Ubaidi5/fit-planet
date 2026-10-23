"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyReviewAction } from "@/actions/studio";
import { useToast } from "@/components/notifications/ToastProvider";

export function ReviewReply({ reviewId, existing }: { reviewId: string; existing?: string }) {
  const t = useTranslations("studio.reply");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existing ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="h-9 cursor-pointer rounded-full px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
        {existing ? t("edit") : t("reply")}
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
        placeholder={t("placeholder")}
        className="block w-full rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="h-9 cursor-pointer rounded-full px-3 text-sm font-medium text-gray-600 hover:bg-gray-900/5">
          {t("cancel")}
        </button>
        <button
          type="button"
          disabled={pending || text.trim().length < 2}
          onClick={() =>
            startTransition(async () => {
              const result = await replyReviewAction(reviewId, text);
              if (result.ok) {
                toast.success(t("posted"));
                setOpen(false);
                router.refresh();
              } else toast.error(t("failed"), result.error);
            })
          }
          className="h-9 cursor-pointer rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          {pending ? t("posting") : t("post")}
        </button>
      </div>
    </div>
  );
}
