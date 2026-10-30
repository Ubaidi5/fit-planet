import type { MetadataRoute } from "next";
import { env } from "@/server/env";
import { collections } from "@/server/db/collections";
import { reportError } from "@/lib/monitoring";

// Rebuilt at most hourly; new gyms appear without a deploy
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${env.appUrl}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/gyms"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/studio/register"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/imprint"), changeFrequency: "yearly", priority: 0.2 },
  ];
  try {
    const gyms = await (await collections.gyms())
      .find({ status: "published" }, { projection: { slug: 1, updatedAt: 1, "address.city": 1 } })
      .sort({ updatedAt: -1 })
      .limit(45_000)
      .toArray();
    const cities = [...new Set(gyms.map((g) => g.address.city).filter(Boolean))];
    return [
      ...pages,
      ...cities.map((city) => ({ url: url(`/gyms?city=${encodeURIComponent(city)}`), changeFrequency: "daily" as const, priority: 0.8 })),
      ...gyms.map((g) => ({ url: url(`/gyms/${g.slug}`), lastModified: g.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ];
  } catch (error) {
    // Without a database the static pages are still worth listing
    reportError("[sitemap] could not list gyms", error);
    return pages;
  }
}
