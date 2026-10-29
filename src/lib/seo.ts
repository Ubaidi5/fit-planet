import type { Gym } from "@/lib/types";

/** URL-safe city name: "New York" -> "new-york". Cities in a non-Latin script keep their letters. */
export function citySlug(city: string) {
  const latin = city
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return latin || city.trim().toLowerCase().replace(/\s+/g, "-");
}

/** The landing page for a city, optionally narrowed to one category */
export function cityPath(city: string, category?: string) {
  const base = `/gyms/in/${encodeURIComponent(citySlug(city))}`;
  return category ? `${base}/${category}` : base;
}

const hasTag = (list: string[], tag: string) => list.some((item) => item.toLowerCase() === tag);

/**
 * Searchable kinds of gym that get their own page per city. The slug is the
 * URL, the key names the copy in the "cityPages.categories" messages.
 */
export const SEO_CATEGORIES = [
  { slug: "open-24-7", key: "open247", match: (g: Gym) => g.hours.is24Hours },
  { slug: "yoga", key: "yoga", match: (g: Gym) => hasTag(g.equipmentTypes, "yoga") },
  { slug: "pilates", key: "pilates", match: (g: Gym) => hasTag(g.equipmentTypes, "pilates") },
  { slug: "crossfit", key: "crossfit", match: (g: Gym) => hasTag(g.equipmentTypes, "crossfit") },
  { slug: "boxing", key: "boxing", match: (g: Gym) => hasTag(g.equipmentTypes, "boxing") },
  { slug: "martial-arts", key: "martialArts", match: (g: Gym) => hasTag(g.equipmentTypes, "martial arts") },
  { slug: "powerlifting", key: "powerlifting", match: (g: Gym) => hasTag(g.equipmentTypes, "powerlifting") || hasTag(g.equipmentTypes, "olympic lifting") },
  { slug: "spin", key: "spin", match: (g: Gym) => hasTag(g.equipmentTypes, "spin") },
  { slug: "swimming-pool", key: "pool", match: (g: Gym) => hasTag(g.amenities, "pool") || hasTag(g.equipmentTypes, "swimming") },
  { slug: "sauna", key: "sauna", match: (g: Gym) => hasTag(g.amenities, "sauna") || hasTag(g.amenities, "steam room") },
  { slug: "spa", key: "spa", match: (g: Gym) => hasTag(g.amenities, "spa") },
  { slug: "women-only", key: "womenOnly", match: (g: Gym) => hasTag(g.amenities, "women-only area") },
  { slug: "personal-training", key: "personalTraining", match: (g: Gym) => hasTag(g.amenities, "personal training") },
  { slug: "group-classes", key: "groupClasses", match: (g: Gym) => hasTag(g.amenities, "group classes") },
  { slug: "wheelchair-accessible", key: "wheelchair", match: (g: Gym) => hasTag(g.amenities, "wheelchair access") },
] as const;

export type SeoCategory = (typeof SEO_CATEGORIES)[number];

export function findCategory(slug: string): SeoCategory | undefined {
  return SEO_CATEGORIES.find((c) => c.slug === slug);
}

/** A category page with fewer gyms than this is thin content: shown to people, kept out of search */
export const MIN_INDEXABLE_GYMS = 2;

/** Serialises structured data for a <script type="application/ld+json">, so listing text can't close the tag */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
