import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { collections, ensureIndexes, toObjectId } from "@/server/db/collections";
import type { GymDoc, ReviewDoc } from "@/server/db/models";
import type { Gym, GymDetail, GymProfile, Review } from "@/lib/types";
import { generateDefaultDetails } from "@/lib/data/mock-gym-details";
import { crowdForecast } from "@/lib/data/crowd";

/** How long a check-in counts towards "people in the gym right now" */
export const VISIT_MINUTES = 90;

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Maps a stored gym to the UI shape the components already use */
export function toGym(doc: GymDoc, currentOccupancy = 0): Gym {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    coverImage: doc.coverImage,
    images: doc.images,
    address: doc.address,
    country: doc.country,
    currency: doc.currency,
    timezone: doc.timezone,
    location: { lat: doc.location.coordinates[1], lng: doc.location.coordinates[0] },
    rating: doc.rating,
    totalReviews: doc.totalReviews,
    pricing: { dayPass: doc.pricing.dayPass, weekPass: doc.pricing.weekPass, monthPass: doc.pricing.monthPass },
    amenities: doc.amenities,
    equipmentTypes: doc.equipmentTypes,
    hours: doc.hours,
    capacity: { current: Math.min(currentOccupancy, doc.capacity.max), max: doc.capacity.max },
    isVerified: doc.isVerified,
    isFeatured: doc.isFeatured,
  };
}

export function toReview(doc: ReviewDoc): Review {
  return {
    id: doc._id.toHexString(),
    userId: doc.userId?.toHexString() ?? "",
    userName: doc.authorName,
    userAvatar: doc.authorImage ?? undefined,
    rating: doc.rating,
    title: doc.title,
    comment: doc.comment,
    date: doc.createdAt.toISOString(),
    helpful: doc.helpful,
    categories: doc.categories,
    gymResponse: doc.reply ? { response: doc.reply.text, date: doc.reply.at.toISOString() } : undefined,
    isVerified: doc.isVerified,
  };
}

/** People checked in during the last VISIT_MINUTES, per gym */
export async function occupancyFor(gymIds: ObjectId[]): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (gymIds.length === 0) return result;
  const checkins = await collections.checkins();
  const since = new Date(Date.now() - VISIT_MINUTES * 60_000);
  const rows = await checkins
    .aggregate<{ _id: ObjectId; count: number }>([
      { $match: { gymId: { $in: gymIds }, at: { $gte: since } } },
      { $group: { _id: "$gymId", count: { $sum: 1 } } },
    ])
    .toArray();
  for (const row of rows) result.set(row._id.toHexString(), row.count);
  return result;
}

export interface GymQuery {
  city?: string;
  country?: string;
  q?: string;
  limit?: number;
}

export async function listPublishedGyms(query: GymQuery = {}): Promise<Gym[]> {
  await ensureIndexes();
  const gyms = await collections.gyms();
  const filter: Filter<GymDoc> = { status: "published" };
  if (query.city) filter["address.city"] = query.city;
  if (query.country) filter.country = query.country;
  if (query.q) {
    const pattern = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: pattern }, { "address.area": pattern }, { "address.city": pattern }, { amenities: pattern }];
  }
  const docs = await gyms
    .find(filter)
    .sort({ isFeatured: -1, rating: -1 })
    .limit(query.limit ?? 200)
    .toArray();
  const occupancy = await occupancyFor(docs.map((d) => d._id));
  return docs.map((doc) => toGym(doc, occupancy.get(doc._id.toHexString()) ?? 0));
}

/** Cities that have at least one live gym, with counts */
export async function listCities(): Promise<{ city: string; country: string; count: number }[]> {
  const gyms = await collections.gyms();
  const rows = await gyms
    .aggregate<{ _id: { city: string; country: string }; count: number }>([
      { $match: { status: "published" } },
      { $group: { _id: { city: "$address.city", country: "$country" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();
  return rows.map((row) => ({ city: row._id.city, country: row._id.country, count: row.count }));
}

export async function findGymDoc(idOrSlug: string): Promise<GymDoc | null> {
  const gyms = await collections.gyms();
  const id = toObjectId(idOrSlug);
  return gyms.findOne(id ? { $or: [{ _id: id }, { slug: idOrSlug }] } : { slug: idOrSlug });
}

/** Builds the full profile (details, reviews, crowd curve) for a gym page */
export async function buildProfile(doc: GymDoc): Promise<GymProfile> {
  const [occupancy, reviewDocs] = await Promise.all([
    occupancyFor([doc._id]),
    (await collections.reviews()).find({ gymId: doc._id }).sort({ createdAt: -1 }).limit(30).toArray(),
  ]);
  const gym = toGym(doc, occupancy.get(doc._id.toHexString()) ?? 0);
  const defaults = generateDefaultDetails(gym);
  const forecast = crowdForecast(gym);

  const details: GymDetail = {
    id: gym.id,
    longDescription: doc.longDescription || doc.description || defaults.longDescription,
    gallery: doc.images.map((url, index) => ({ url, caption: `${doc.name} photo ${index + 1}`, category: "Facility" as const })),
    operatingHours: doc.operatingHours?.length ? doc.operatingHours : defaults.operatingHours,
    equipment: doc.equipment ?? [],
    trainers: doc.trainers ?? [],
    classes: doc.classes ?? [],
    reviews: reviewDocs.map(toReview),
    ratingBreakdown: doc.ratingBreakdown ?? defaults.ratingBreakdown,
    addOns: doc.addOns ?? defaults.addOns,
    annualPass: doc.pricing.annualPass,
    specialPackages: [],
    policies: doc.policies ?? defaults.policies,
    crowdData: forecast.map((occupancy, hour) => ({ hour, occupancy })),
    contact: { phone: doc.contact?.phone ?? "", email: doc.contact?.email ?? "", ...doc.contact },
  };

  return { gym, details, status: doc.status, ownerId: doc.ownerId.toHexString() };
}

export async function getPublicGymProfile(idOrSlug: string): Promise<GymProfile | null> {
  const doc = await findGymDoc(idOrSlug);
  if (!doc || doc.status !== "published") return null;
  return buildProfile(doc);
}

/** Gyms a user owns or staffs */
export async function gymsManagedBy(userId: ObjectId): Promise<GymDoc[]> {
  const gyms = await collections.gyms();
  return gyms.find({ $or: [{ ownerId: userId }, { staffIds: userId }] }).sort({ createdAt: 1 }).toArray();
}

export async function uniqueSlug(name: string, city: string, excludeId?: ObjectId) {
  const gyms = await collections.gyms();
  const base = slugify(`${name} ${city}`) || "gym";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const clash = await gyms.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }, { projection: { _id: 1 } });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${new ObjectId().toHexString().slice(-6)}`;
}

/** Recomputes the rating summary after a review is added */
export async function refreshRating(gymId: ObjectId) {
  const reviews = await collections.reviews();
  const [summary] = await reviews
    .aggregate<{ avg: number; count: number; c: number; e: number; s: number; v: number }>([
      { $match: { gymId } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
          c: { $avg: "$categories.cleanliness" },
          e: { $avg: "$categories.equipment" },
          s: { $avg: "$categories.staff" },
          v: { $avg: "$categories.value" },
        },
      },
    ])
    .toArray();
  const round = (n: number) => Math.round(n * 10) / 10;
  const gyms = await collections.gyms();
  await gyms.updateOne(
    { _id: gymId },
    summary
      ? {
          $set: {
            rating: round(summary.avg),
            totalReviews: summary.count,
            ratingBreakdown: { cleanliness: round(summary.c), equipment: round(summary.e), staff: round(summary.s), value: round(summary.v) },
          },
        }
      : { $set: { rating: 0, totalReviews: 0 } },
  );
}
