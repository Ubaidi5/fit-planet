"use client";

import * as Sentry from "@sentry/nextjs";
import { sentryOptions, type MonitoringConfig } from "@/lib/monitoring";

let started = false;

/**
 * Starts browser error monitoring with settings from the server, so the DSN
 * stays a runtime setting like every other key. Renders nothing.
 */
export function MonitoringInit({ config }: { config: MonitoringConfig }) {
  // During render, not in an effect, so errors in the first effects are caught too
  if (!started && typeof window !== "undefined" && config.dsn) {
    started = true;
    Sentry.init(sentryOptions(config));
  }
  return null;
}
