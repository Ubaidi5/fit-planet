import type { MetadataRoute } from "next";
import { env } from "@/server/env";
import { collections } from "@/server/db/collections";
import { cityPath, MIN_INDEXABLE_GYMS } from "@/lib/seo";
import { seoSitemapEntries } from "@/server/modules/seo";

// Rebuilt at most hourly; new gyms appear without a deploy
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${env.appUrl}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/gyms"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/gyms/in"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/studio/register"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/imprint"), changeFrequency: "yearly", priority: 0.2 },
  ];
  try {
    const [gyms, landings] = await Promise.all([
      (await collections.gyms())
        .find({ status: "published" }, { projection: { slug: 1, updatedAt: 1 } })
        .sort({ updatedAt: -1 })
        .limit(40_000)
        .toArray(),
      seoSitemapEntries(),
    ]);
    return [
      ...pages,
      // Category pages below the threshold are noindex, so they stay out
      ...landings
        .filter((entry) => !entry.category || entry.count >= MIN_INDEXABLE_GYMS)
        .map((entry) => ({ url: url(cityPath(entry.city, entry.category)), changeFrequency: "daily" as const, priority: entry.category ? 0.7 : 0.8 })),
      ...gyms.map((g) => ({ url: url(`/gyms/${g.slug}`), lastModified: g.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ];
  } catch (error) {
    // Without a database the static pages are still worth listing
    console.error("[sitemap] could not list gyms", error);
    return pages;
  }
}
