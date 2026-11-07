"use client";

import { useTranslations } from "next-intl";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { toggleSavedGymAction } from "@/actions/member";
import { useToast } from "@/components/notifications/ToastProvider";
import { track } from "@/lib/analytics/browser";

export function SaveGymButton({ gymId, saved, signedIn, className, label = true }: { gymId: string; saved: boolean; signedIn: boolean; className?: string; label?: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("gym");

  return (
    <button
      type="button"
      aria-pressed={optimistic}
      aria-label={optimistic ? t("unsave") : t("saveGym")}
      onClick={() => {
        if (!signedIn) return router.push(`/login?next=${encodeURIComponent(location.pathname)}`);
        startTransition(async () => {
          setOptimistic(!optimistic);
          const result = await toggleSavedGymAction(gymId);
          if (!result.ok) toast.error(t("saveFailed"), result.error);
          else if (!optimistic) track({ name: "save_gym", gymId });
          router.refresh();
        });
      }}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-ink shadow-soft ring-1 ring-gray-900/[0.06] transition-transform active:scale-95",
        !label && "w-10 px-0",
        className,
      )}
    >
      {optimistic ? <HiHeart className="size-5 text-stamp-magenta" /> : <HiOutlineHeart className="size-5" />}
      {label && (optimistic ? t("saved") : t("save"))}
    </button>
  );
}
