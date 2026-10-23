"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineXMark } from "react-icons/hi2";
import { shareRoutineAction, shareWorkoutAction } from "@/actions/social";
import { useToast } from "@/components/notifications/ToastProvider";
import { cn } from "@/lib/utils";

interface Props {
  kind: "workout" | "routine";
  id: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

/** Opens a caption sheet, then posts the workout or routine to the member's feed */
export function ShareToFeed({ kind, id, title, className, children }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [pending, startTransition] = useTransition();

  const share = () =>
    startTransition(async () => {
      const result = kind === "workout" ? await shareWorkoutAction(id, caption) : await shareRoutineAction(id, caption);
      if (!result.ok) return toast.error("Couldn't share", result.error);
      setOpen(false);
      toast.success("Shared to your feed");
      router.push(`/app/social/post/${result.data.postId}`);
    });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
        {children ?? "Share to feed"}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Share to feed">
          <button type="button" aria-label="Close" className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative w-full rounded-t-[2rem] bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift sm:max-w-md sm:rounded-[2rem]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">Share {kind}</p>
                <h2 className="mt-0.5 text-lg font-semibold text-ink">{title}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="-me-2 flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-900/5">
                <HiOutlineXMark className="size-5" />
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={1000}
              rows={3}
              autoFocus
              placeholder={kind === "workout" ? "How did it feel? (optional)" : "Why you like this routine (optional)"}
              className="mt-4 w-full resize-none rounded-2xl bg-canvas px-4 py-3 text-[15px] text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-ink/10"
            />
            <button type="button" onClick={share} disabled={pending} className="mt-3 h-12 w-full cursor-pointer rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-60">
              {pending ? "Sharing…" : "Post to feed"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
