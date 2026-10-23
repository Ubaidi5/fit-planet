import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isProd = process.env.NODE_ENV === "production";

/**
 * Baseline browser protections for every page. Scripts aren't restricted by
 * CSP here (Next's inline bootstrap would need nonces); these directives block
 * framing, plugin content and <base> tricks without risking breakage.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ["frame-ancestors 'none'", "base-uri 'self'", "object-src 'none'", ...(isProd ? ["upgrade-insecure-requests"] : [])].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera for the front-desk QR scanner, location for "gyms near me"
  { key: "Permissions-Policy", value: "camera=(self), geolocation=(self), microphone=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
];

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
      { protocol: "https", hostname: "*.r2.dev" },
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
