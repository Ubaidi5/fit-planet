import * as Sentry from "@sentry/nextjs";

/**
 * Error monitoring shared by the server and the browser. Sentry only runs
 * when SENTRY_DSN is set; until then every call here is a no-op apart from
 * the console line.
 *
 * Privacy: events never carry who the visitor is. Cookies, headers, request
 * bodies, query strings (reset and magic-link tokens live there) and database
 * values are never collected, and anything shaped like an email address,
 * token or card number is masked before an event leaves.
 */

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const BEARER = /\b(bearer|token|secret|key|password)(["'=:\s]+)[^\s"'&]+/gi;
const CARD = /\b(?:\d[ -]?){13,19}\b/g;

export function scrub(text: string) {
  return text.replace(EMAIL, "[email]").replace(BEARER, "$1$2[redacted]").replace(CARD, "[number]");
}

/** Drops query strings and fragments from a URL, keeping the path */
function stripQuery(url: string | undefined) {
  return url?.replace(/[?#].*$/, "");
}

type SentryEvent = Sentry.Event;

function scrubEvent<T extends SentryEvent>(event: T): T {
  delete event.user;
  if (event.request) {
    event.request = { url: stripQuery(event.request.url), method: event.request.method };
  }
  if (event.message) event.message = scrub(event.message);
  for (const ex of event.exception?.values ?? []) {
    if (ex.value) ex.value = scrub(ex.value);
  }
  for (const crumb of event.breadcrumbs ?? []) {
    if (crumb.message) crumb.message = scrub(crumb.message);
    if (crumb.data?.url) crumb.data.url = stripQuery(String(crumb.data.url));
    if (crumb.data?.to) crumb.data.to = stripQuery(String(crumb.data.to));
    if (crumb.data?.from) crumb.data.from = stripQuery(String(crumb.data.from));
  }
  return event;
}

export interface MonitoringConfig {
  dsn?: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
}

/** Options both runtimes share; each side adds its own integrations */
export function sentryOptions(config: MonitoringConfig) {
  return {
    dsn: config.dsn,
    enabled: Boolean(config.dsn),
    environment: config.environment,
    release: config.release,
    tracesSampleRate: config.tracesSampleRate,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      databaseQueryData: false,
    },
    // Noise from browser extensions, flaky networks and aborted navigations
    ignoreErrors: ["ResizeObserver loop", "AbortError", "NEXT_REDIRECT", "NEXT_NOT_FOUND", "Load failed", "Failed to fetch", "NetworkError when attempting to fetch resource"],
    beforeSend: scrubEvent,
    beforeSendTransaction: scrubEvent,
  } satisfies Sentry.BrowserOptions;
}

/**
 * Logs an unexpected error and sends it to Sentry. The label reads like the
 * log line, "[booking] create failed"; its bracketed part becomes the "area"
 * tag so issues group by feature.
 */
export function reportError(label: string, error: unknown, extra?: Record<string, string | number | boolean | undefined>) {
  console.error(label, error);
  Sentry.withScope((scope) => {
    scope.setTag("area", label.match(/^\[([^\]]+)\]/)?.[1] ?? "app");
    scope.setContext("where", { label, ...extra });
    Sentry.captureException(error);
  });
}
