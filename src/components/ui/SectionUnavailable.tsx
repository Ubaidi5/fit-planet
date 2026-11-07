"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface SectionUnavailableProps {
  /** Runs after the page's server data is re-fetched, e.g. to reset a boundary */
  onRetry?: () => void;
  /** "card" sits in place of a widget, "page" fills a shell's content area */
  variant?: "card" | "page";
  /** Server reference shown so support can find the log entry */
  reference?: string;
  className?: string;
}

/**
 * Shown in place of one part of a page that couldn't load, so the rest of
 * the page keeps working.
 */
export function SectionUnavailable({ onRetry, variant = "card", reference, className }: SectionUnavailableProps) {
  const t = useTranslations("errorPage");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const retry = () =>
    startTransition(() => {
      router.refresh();
      onRetry?.();
    });
  const page = variant === "page";

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-start gap-4 rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 sm:flex-row sm:items-center sm:justify-between",
        page ? "p-6 sm:p-8" : "p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-stamp-magenta ring-4 ring-stamp-magenta/15" />
        <div className="min-w-0">
          <p className={cn("font-semibold text-ink", page ? "text-lg tracking-[-0.02em]" : "text-[15px]")}>{t(page ? "errorTitle" : "sectionTitle")}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-pretty text-gray-500">{t(page ? "errorText" : "sectionText")}</p>
          {reference && <p className="mt-2 font-mono text-xs text-gray-400">{t("reference", { id: reference })}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={retry}
        disabled={pending}
        className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
      >
        <HiArrowPath className={cn("size-4", pending && "animate-spin")} />
        {t("retry")}
      </button>
    </div>
  );
}
