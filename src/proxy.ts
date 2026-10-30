import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

// ── Sign-in gate ─────────────────────────────────────────────────────────────
// Cheap gate in front of the member app and the studio: no session cookie
// means straight to sign-in, with a way back. Layouts still verify the session
// properly on the server; this only saves a render and keeps the return path.

const PUBLIC_PATHS = new Set(["/studio/login", "/studio/join", "/studio/register", "/studio/forgot-password", "/app/login", "/app/register"]);
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];
const GATED = /^\/(app|studio|admin)(\/|$)/;

function signInRedirect(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!GATED.test(pathname) || PUBLIC_PATHS.has(pathname)) return null;
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name) || request.cookies.has(`${name}.0`));
  if (hasSession) return null;
  const login = new URL(pathname.startsWith("/studio") ? "/studio/login" : "/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

// ── Request flood limit ──────────────────────────────────────────────────────
// nginx already caps every IP at 15 requests a second. This second layer
// counts only requests that do work (form posts, server actions, API calls) in
// this process's memory, so it costs nothing per request and still holds if
// the app is ever reached without nginx in front. Finer per-account limits for
// sign-in, posting and bookings live in src/server/rate-limit.ts.

const WINDOW_MS = 60_000;
const LIMITS = { write: 120, api: 300 } as const;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest) {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function overLimit(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  const isWrite = request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  if (!isApi && !isWrite) return null;
  // Payment providers retry webhooks from shared IPs; they're signature-checked instead
  if (request.nextUrl.pathname.startsWith("/api/webhooks/")) return null;

  const kind = isWrite ? "write" : "api";
  const key = `${kind}:${clientIp(request)}`;
  const now = Date.now();
  let entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    // Sweep finished windows now and then so the map can't grow without bound
    if (hits.size > 50_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    entry = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(key, entry);
  }
  entry.count++;
  if (entry.count <= LIMITS[kind]) return null;
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
  return new NextResponse("Too many requests. Please wait a moment and try again.", {
    status: 429,
    headers: { "Retry-After": String(retryAfter), "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

// ── Content Security Policy ──────────────────────────────────────────────────
// Every page gets a fresh nonce; Next adds it to its own scripts, and
// 'strict-dynamic' lets those scripts load what they need (tag managers,
// payment and push SDKs). An injected <script> without the nonce never runs,
// which is what stops stored or reflected XSS from doing anything.

function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React and next/font write inline style attributes
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob: https:",
    // Analytics, Firebase push and Sentry talk to their own hosts
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    // Sign-in and checkout forms end in a redirect to Google, Facebook or Stripe
    "form-action 'self' https://accounts.google.com https://www.facebook.com https://checkout.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/** Prefetches and data requests don't render a document, so they don't need a nonce */
function isDocumentRequest(request: NextRequest) {
  if (request.method !== "GET") return false;
  if (request.nextUrl.pathname.startsWith("/api/")) return false;
  if (request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") return false;
  return true;
}

export function proxy(request: NextRequest) {
  const limited = overLimit(request);
  if (limited) return limited;

  const redirect = signInRedirect(request);
  if (redirect) return redirect;

  if (!isDocumentRequest(request)) return NextResponse.next();

  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);
  // Next reads the nonce from the request's CSP header and stamps its scripts with it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Everything except build assets, optimized images, uploads and the push service worker
  matcher: ["/((?!_next/static|_next/image|media/|firebase-messaging-sw\\.js|favicon\\.ico|icon|apple-icon|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)"],
};
