"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Stamp } from "@/components/passport/Stamp";
import { reportError } from "@/lib/monitoring";

/** Shown when a page throws; the rest of the app keeps working */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    // Errors with a digest were thrown on the server and are already reported there
    if (error.digest) console.error(error);
    else reportError("[page] render failed", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Stamp code="500" label={t("stampLabel")} tone="magenta" />
        <h1 className="mt-8 text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-5xl">{t("errorTitle")}</h1>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-pretty text-gray-500">{t("errorText")}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="flex h-12 cursor-pointer items-center justify-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800"
          >
            {t("retry")}
          </button>
          <Link href="/" className="flex h-12 items-center justify-center rounded-full bg-surface px-6 text-[15px] font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-white">
            {t("home")}
          </Link>
        </div>
        {/* The digest matches the server log entry, without revealing the error itself */}
        {error.digest && <p className="mt-6 font-mono text-xs text-gray-400">{t("reference", { id: error.digest })}</p>}
      </div>
    </main>
  );
}
