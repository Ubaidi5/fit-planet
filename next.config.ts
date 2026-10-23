import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/app/social/:path*", destination: "/app/dashboard", permanent: false },
      { source: "/app/routines/builder", destination: "/app/routines/new", permanent: false },
      { source: "/app/routines/workout", destination: "/app/routines", permanent: false },
    ];
  },
  async headers() {
    return [
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

export default nextConfig;
