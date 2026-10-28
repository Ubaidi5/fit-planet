"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/browser";
import type { AnalyticsEvent } from "@/lib/analytics/events";

/**
 * Sends one funnel event when a server-rendered page mounts. With `once`,
 * a refresh of the same page doesn't send it again.
 */
export function TrackEvent({ event, once }: { event: AnalyticsEvent; once?: string }) {
  const payload = JSON.stringify(event);
  useEffect(() => {
    if (once) {
      try {
        const key = `fp_tracked_${once}`;
        if (localStorage.getItem(key)) return;
        localStorage.setItem(key, "1");
      } catch {
        // Storage blocked; the platforms dedupe by event id anyway
      }
    }
    track(JSON.parse(payload) as AnalyticsEvent);
  }, [payload, once]);
  return null;
}
