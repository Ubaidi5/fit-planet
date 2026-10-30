"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring";
import { SectionUnavailable } from "./SectionUnavailable";

/**
 * Error screen for a section of the site that has its own shell (member app,
 * studio, admin). It renders inside that shell, so navigation keeps working
 * and only the failed page shows the retry card.
 */
export function SegmentError({ area, error, reset }: { area: string; error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Errors with a digest were thrown on the server and are already reported there
    if (error.digest) console.error(error);
    else reportError(`[${area}] page failed`, error);
  }, [area, error]);

  return <SectionUnavailable variant="page" reference={error.digest} onRetry={reset} className="my-2" />;
}
