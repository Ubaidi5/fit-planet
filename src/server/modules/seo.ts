import "server-only";
import { cache } from "react";
import { collections } from "@/server/db/collections";
import { listCities, listPublishedGyms } from "@/server/modules/gyms";
import { citySlug, SEO_CATEGORIES, type SeoCategory } from "@/lib/seo";
import type { Gym } from "@/lib/types";

export interface PriceRow {
  from: number;
  average: number;
}

export interface CityLandingData {
  city: string;
  country: string;
  /** All live gyms in the city; `gyms` is this narrowed to the category */
  cityGymCount: number;
  gyms: Gym[];
  category?: SeoCategory;
  /** The city's most common currency; prices are only compared within it */
  currency: string;
  prices: { day: PriceRow; week?: PriceRow; month?: PriceRow };
  averageRating?: number;
  totalReviews: number;
  open247: Gym[];
  topRated?: Gym;
  areas: { name: string; count: number }[];
  /** Categories that have at least one gym in this city */
  categories: { category: SeoCategory; count: number }[];
  otherCities: { city: string; country: string; count: number }[];
}

function priceRow(values: number[]): PriceRow | undefined {
  const paid = values.filter((v) => v > 0);
  if (paid.length === 0) return undefined;
  const average = paid.reduce((sum, v) => sum + v, 0) / paid.length;
  return { from: Math.min(...paid), average: Math.round(average * 100) / 100 };
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

/** Everything a city (or city + category) landing page shows; null when the city has no live gyms */
export const cityLanding = cache(async (slug: string, categorySlug?: string): Promise<CityLandingData | null> => {
  const cities = await listCities();
  const match = cities.find((c) => citySlug(c.city) === slug);
  if (!match) return null;

  const category = categorySlug ? SEO_CATEGORIES.find((c) => c.slug === categorySlug) : undefined;
  if (categorySlug && !category) return null;

  const all = await listPublishedGyms({ city: match.city, limit: 500 });
  if (all.length === 0) return null;
  const gyms = (category ? all.filter(category.match) : all).sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);
  if (gyms.length === 0) return null;

  const currency = mostCommon(gyms.map((g) => g.currency));
  const priced = gyms.filter((g) => g.currency === currency);
  const reviewed = gyms.filter((g) => g.totalReviews > 0);
  const totalReviews = reviewed.reduce((sum, g) => sum + g.totalReviews, 0);

  const areas = new Map<string, number>();
  for (const gym of gyms) if (gym.address.area) areas.set(gym.address.area, (areas.get(gym.address.area) ?? 0) + 1);

  return {
    city: match.city,
    country: match.country,
    cityGymCount: all.length,
    gyms,
    category,
    currency,
    prices: {
      day: priceRow(priced.map((g) => g.pricing.dayPass)) ?? { from: 0, average: 0 },
      week: priceRow(priced.map((g) => g.pricing.weekPass)),
      month: priceRow(priced.map((g) => g.pricing.monthPass)),
    },
    // Weighted by review count, so one five-star newcomer doesn't lead the city
    averageRating: totalReviews > 0 ? Math.round((reviewed.reduce((sum, g) => sum + g.rating * g.totalReviews, 0) / totalReviews) * 10) / 10 : undefined,
    totalReviews,
    open247: gyms.filter((g) => g.hours.is24Hours),
    topRated: reviewed[0],
    areas: [...areas].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    categories: SEO_CATEGORIES.map((c) => ({ category: c, count: all.filter(c.match).length })).filter((c) => c.count > 0),
    otherCities: cities.filter((c) => c.city !== match.city),
  };
});

export interface CityDirectoryRow {
  city: string;
  country: string;
  count: number;
  dayFrom: number;
  currency: string;
}

/** Every city with live gyms, with its cheapest day pass, for the cities hub */
export async function cityDirectory(): Promise<CityDirectoryRow[]> {
  const gyms = await collections.gyms();
  const rows = await gyms
    .aggregate<{ _id: { city: string; country: string; currency: string }; count: number; dayFrom: number }>([
      { $match: { status: "published" } },
      { $group: { _id: { city: "$address.city", country: "$country", currency: "$currency" }, count: { $sum: 1 }, dayFrom: { $min: "$pricing.dayPass" } } },
      { $sort: { count: -1 } },
    ])
    .toArray();
  // A city with gyms in two currencies shows the one most of its gyms use
  const byCity = new Map<string, CityDirectoryRow>();
  for (const row of rows) {
    const key = `${row._id.country}|${row._id.city}`;
    const prev = byCity.get(key);
    if (prev) prev.count += row.count;
    else byCity.set(key, { city: row._id.city, country: row._id.country, count: row.count, dayFrom: row.dayFrom, currency: row._id.currency });
  }
  return [...byCity.values()].sort((a, b) => b.count - a.count);
}

/** City and category pages for the sitemap */
export async function seoSitemapEntries(): Promise<{ city: string; category?: string; count: number }[]> {
  const cities = await listCities();
  const entries: { city: string; category?: string; count: number }[] = [];
  for (const { city, count } of cities) {
    entries.push({ city, count });
    const gyms = await listPublishedGyms({ city, limit: 500 });
    for (const category of SEO_CATEGORIES) {
      const matches = gyms.filter(category.match).length;
      if (matches > 0) entries.push({ city, category: category.slug, count: matches });
    }
  }
  return entries;
}
