"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowTopRightOnSquare, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { setGymStatusAction } from "@/actions/studio";
import { useToast } from "@/components/notifications/ToastProvider";

export function PublishCard({ gymId, slug, status, checklist }: { gymId: string; slug: string; status: "draft" | "published" | "suspended"; checklist: { label: string; done: boolean }[] }) {
  const t = useTranslations("studio.publish");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const live = status === "published";
  const ready = checklist.every((c) => c.done);

  return (
    <section className={cn("overflow-hidden rounded-[1.75rem] shadow-soft ring-1", live ? "bg-ink text-white ring-ink" : "bg-surface ring-gray-900/[0.06]")}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className={cn("flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase", live ? "text-volt" : "text-stamp-ochre")}>
            <span className={cn("size-1.5 rounded-full", live ? "animate-pulse bg-volt" : "bg-stamp-ochre")} />
            {live ? t("live") : status === "suspended" ? t("suspended") : t("draft")}
          </p>
          <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em]">{live ? t("liveText") : t("hiddenText")}</p>
          {!live && (
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {checklist.map((c) => (
                <li key={c.label} className={cn("flex items-center gap-1.5", c.done ? "text-emerald-700" : "text-gray-500")}>
                  <span className={cn("flex size-4 items-center justify-center rounded-full text-[10px]", c.done ? "bg-emerald-600 text-white" : "ring-1 ring-gray-300")}>{c.done ? "✓" : ""}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/gyms/${slug}`}
            target="_blank"
            className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold", live ? "bg-white/10 text-white hover:bg-white/15" : "text-gray-700 hover:bg-gray-900/5")}
          >
            <HiOutlineArrowTopRightOnSquare className="size-4 rtl:-scale-x-100" />
            {t("preview")}
          </Link>
          <button
            type="button"
            disabled={pending || status === "suspended" || (!live && !ready)}
            onClick={() =>
              startTransition(async () => {
                const result = await setGymStatusAction(gymId, live ? "draft" : "published");
                if (result.ok) {
                  toast.success(result.message ?? t("saved"));
                  router.refresh();
                } else toast.error(t("failed"), result.error);
              })
            }
            className={cn(
              "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
              live ? "bg-white text-ink hover:bg-white/90" : "bg-volt text-ink hover:brightness-95",
            )}
          >
            {live ? <HiOutlineEyeSlash className="size-4" /> : <HiOutlineEye className="size-4" />}
            {pending ? t("saving") : live ? t("unpublish") : t("publish")}
          </button>
        </div>
      </div>
    </section>
  );
}
