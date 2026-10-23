import type { MetadataRoute } from "next";
import { env } from "@/server/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in areas and machinery: nothing useful for search, and some carry personal data
        disallow: ["/app/", "/studio/", "/admin", "/api/", "/checkout/", "/media/"],
      },
    ],
    sitemap: `${env.appUrl}/sitemap.xml`,
    host: env.appUrl,
  };
}
