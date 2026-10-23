"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { HiEllipsisHorizontal, HiOutlinePencilSquare, HiOutlineShare, HiOutlineStar, HiOutlineTrash, HiStar } from "react-icons/hi2";
import { deleteRoutineAction, favoriteRoutineAction } from "@/actions/routines";
import { useToast } from "@/components/notifications/ToastProvider";
import { ShareToFeed } from "@/components/social/ShareToFeed";
import { cn } from "@/lib/utils";

export function RoutineMenu({ id, name, favorite }: { id: string; name: string; favorite: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [starred, setStarred] = useState(favorite);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const toggleStar = () => {
    const next = !starred;
    setStarred(next);
    startTransition(async () => {
      const result = await favoriteRoutineAction(id, next);
      if (!result.ok) {
        setStarred(!next);
        toast.error("Couldn't update", result.error);
      }
    });
  };

  const remove = () => {
    startTransition(async () => {
      const result = await deleteRoutineAction(id);
      if (result.ok) toast.success(`Deleted ${name}`);
      else toast.error("Couldn't delete", result.error);
      setOpen(false);
    });
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggleStar}
        disabled={pending}
        aria-pressed={starred}
        aria-label={starred ? "Remove from favourites" : "Add to favourites"}
        className="flex size-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-900/5 hover:text-ink"
      >
        {starred ? <HiStar className="size-5 text-stamp-ochre" /> : <HiOutlineStar className="size-5" />}
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setConfirming(false);
        }}
        aria-expanded={open}
        aria-label="More actions"
        className="flex size-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-900/5 hover:text-ink"
      >
        <HiEllipsisHorizontal className="size-5" />
      </button>

      {open && (
        <>
          <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-11 z-40 w-48 rounded-2xl border border-gray-900/[0.06] bg-surface p-1.5 shadow-lift">
            <Link href={`/app/routines/${id}/edit`} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-canvas">
              <HiOutlinePencilSquare className="size-4.5 text-gray-400" />
              Edit routine
            </Link>
            <ShareToFeed kind="routine" id={id} title={name} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm font-medium text-gray-700 hover:bg-canvas">
              <HiOutlineShare className="size-4.5 text-gray-400" />
              Share to feed
            </ShareToFeed>
            <button
              type="button"
              onClick={() => (confirming ? remove() : setConfirming(true))}
              disabled={pending}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm font-medium",
                confirming ? "bg-stamp-magenta/10 text-stamp-magenta" : "text-gray-700 hover:bg-canvas",
              )}
            >
              <HiOutlineTrash className={cn("size-4.5", confirming ? "text-stamp-magenta" : "text-gray-400")} />
              {confirming ? "Tap again to delete" : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
