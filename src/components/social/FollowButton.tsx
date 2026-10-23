"use client";

import { useState, useTransition } from "react";
import { followAction } from "@/actions/social";
import { useToast } from "@/components/notifications/ToastProvider";
import { cn } from "@/lib/utils";

export function FollowButton({ userId, following, size = "md", className }: { userId: string; following: boolean; size?: "sm" | "md"; className?: string }) {
  const [on, setOn] = useState(following);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const toggle = () => {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      const result = await followAction(userId, next);
      if (!result.ok) {
        setOn(!next);
        toast.error("Couldn't update", result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      className={cn(
        "shrink-0 cursor-pointer rounded-full font-semibold transition-colors",
        size === "sm" ? "h-8 px-3.5 text-xs" : "h-10 px-5 text-sm",
        on ? "bg-canvas text-ink ring-1 ring-gray-900/10 hover:bg-canvas-deep" : "bg-ink text-white hover:bg-gray-800",
        className,
      )}
    >
      {on ? "Following" : "Follow"}
    </button>
  );
}
