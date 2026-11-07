import "server-only";
import { cache } from "react";
import { collections } from "@/server/db/collections";
import type { Gym } from "@/lib/types";
import { listPublishedGyms } from "./gyms";
import { reportError } from "@/lib/monitoring";

export interface PlatformStats {
  gyms: number;
  /** Cities with live gyms, busiest first */
  cities: string[];
  currencies: number;
}

export interface Story {
  id: string;
  name: string;
  quote: string;
  rating: number;
  gymName: string;
  gymSlug: string;
  city: string;
}

function statsOf(gyms: Gym[]): PlatformStats {
  const perCity = new Map<string, number>();
  for (const gym of gyms) perCity.set(gym.address.city, (perCity.get(gym.address.city) ?? 0) + 1);
  return {
    gyms: gyms.length,
    cities: [...perCity.entries()].sort((a, b) => b[1] - a[1]).map(([city]) => city),
    currencies: new Set(gyms.map((g) => g.currency)).size,
  };
}

/**
 * Live gyms and the counts the marketing pages quote, read once per request.
 * The public site still renders if the database is unreachable; gym sections
 * simply hide.
 */
export const platformSnapshot = cache(async (): Promise<{ gyms: Gym[]; stats: PlatformStats }> => {
  try {
    const gyms = await listPublishedGyms();
    return { gyms, stats: statsOf(gyms) };
  } catch (error) {
    reportError("[platform] could not load gyms", error);
    return { gyms: [], stats: statsOf([]) };
  }
});

/** Recent four and five star reviews with something to say, one per gym */
export async function memberStories(gyms: Gym[], limit = 3): Promise<Story[]> {
  if (gyms.length === 0) return [];
  const byId = new Map(gyms.map((g) => [g.id, g]));
  try {
    const reviews = await collections.reviews();
    const docs = await reviews
      .find({ rating: { $gte: 4 }, $expr: { $gte: [{ $strLenCP: "$comment" }, 60] } })
      .sort({ createdAt: -1 })
      .limit(60)
      .toArray();
    const seen = new Set<string>();
    const stories: Story[] = [];
    for (const doc of docs) {
      const gym = byId.get(doc.gymId.toHexString());
      // Skip reviews whose author deleted their account
      if (!gym || !doc.authorName || seen.has(gym.id)) continue;
      seen.add(gym.id);
      stories.push({
        id: doc._id.toHexString(),
        name: doc.authorName,
        quote: doc.comment.trim(),
        rating: doc.rating,
        gymName: gym.name,
        gymSlug: gym.slug,
        city: gym.address.city,
      });
      if (stories.length === limit) break;
    }
    return stories;
  } catch (error) {
    reportError("[platform] could not load stories", error);
    return [];
  }
}

/** Puts gyms in the visitor's country first, keeping the existing order otherwise */
export function localFirst<T extends { country: string }>(items: T[], country: string): T[] {
  return [...items.filter((i) => i.country === country), ...items.filter((i) => i.country !== country)];
}

/** Country part of a region code such as "AE-AR" */
export function regionCountry(code: string) {
  return code.slice(0, 2);
}
