import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isProd = process.env.NODE_ENV === "production";

/**
 * Baseline browser protections for every response. The Content Security
 * Policy is set per page in src/proxy.ts, because it carries a fresh script
 * nonce on every request.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera for the front-desk QR scanner, location for "gyms near me"
  { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
];

/**
 * The image optimizer downloads remote images on the server, so only hosts we
 * trust may be listed. Uploads on a bucket (R2/S3) come from STORAGE_PUBLIC_URL,
 * never a wildcard like *.r2.dev that anyone can create a bucket under.
 */
function storageImagePattern() {
  const base = process.env.STORAGE_PUBLIC_URL;
  if (!base?.startsWith("https://")) return [];
  const url = new URL(base);
  return [{ protocol: "https" as const, hostname: url.hostname, pathname: `${url.pathname.replace(/\/$/, "")}/**` }];
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  // Self-contained server bundle for the Lightsail deploy (see deploy/)
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      ...storageImagePattern(),
    ],
    // Uploaded media is served from /media by nginx (local storage)
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/**" }],
  },
  experimental: {
    // Photo uploads go through server actions
    serverActions: { bodySizeLimit: "12mb" },
  },
  async redirects() {
    // Demo-only pages that were retired; keep old links working
    return [
      { source: "/app/sessions", destination: "/app/security", permanent: false },
      { source: "/app/email-digest", destination: "/app/notifications", permanent: false },
      { source: "/app/social/buddies", destination: "/app/social/people", permanent: false },
      { source: "/app/social/challenges", destination: "/app/social", permanent: false },
      { source: "/app/routines/builder", destination: "/app/routines/new", permanent: false },
      { source: "/app/routines/workout", destination: "/app/routines", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
