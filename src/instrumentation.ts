import * as Sentry from "@sentry/nextjs";

/**
 * Starts error monitoring when the server boots. A broken or missing Sentry
 * setup must never stop the site from starting, so failures are only logged.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;
  try {
    const [{ sentryOptions }, { env }, { serverRelease }] = await Promise.all([
      import("@/lib/monitoring"),
      import("@/server/env"),
      import("@/server/release"),
    ]);
    Sentry.init({
      ...sentryOptions({ ...env.monitoring, dsn, release: serverRelease() }),
      // Tracing through OpenTelemetry and module hooks isn't needed for error
      // reports, and the hooks aren't reliable under the Bun runtime
      enableOpenTelemetrySetup: false,
      enableRuntimeChannelInjection: false,
    });
  } catch (error) {
    console.error("[monitoring] Sentry failed to start", error);
  }
}

/** Errors thrown while rendering pages, server actions and route handlers */
export const onRequestError = Sentry.captureRequestError;
