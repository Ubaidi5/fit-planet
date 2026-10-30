/**
 * Writes the sample gyms from src/lib/data/mock-gyms.ts, with their reviews.
 * Matched by slug, so running it again updates them instead of adding copies.
 */
import { ObjectId } from "mongodb";
import { mockGyms } from "@/lib/data/mock-gyms";
import { getGymDetails, generateDefaultDetails } from "@/lib/data/mock-gym-details";
import { collections } from "@/server/db/collections";
import type { GymDoc } from "@/server/db/models";
import { refreshRating } from "@/server/modules/gyms";

/** Owner id for sample studios; no account has it, so nobody can manage them from the studio portal */
export const SAMPLE_OWNER_ID = new ObjectId("000000000000000000000001");

export async function upsertDemoGyms(place: (index: number) => { ownerId: ObjectId; isDemo: boolean }) {
  const gyms = await collections.gyms();
  const reviews = await collections.reviews();
  const gymIds: ObjectId[] = [];
  for (const [index, gym] of mockGyms.entries()) {
    const details = getGymDetails(gym.id) ?? generateDefaultDetails(gym);
    const now = new Date();
    const placement = place(index);
    const doc: Omit<GymDoc, "_id"> = {
      ownerId: placement.ownerId,
      status: "published",
      name: gym.name,
      slug: gym.slug,
      description: gym.description,
      longDescription: details.longDescription,
      coverImage: gym.coverImage,
      images: [...new Set([gym.coverImage, ...gym.images, ...details.gallery.map((g) => g.url)])],
      address: gym.address,
      country: gym.country,
      currency: gym.currency,
      timezone: gym.timezone,
      location: { type: "Point", coordinates: [gym.location.lng, gym.location.lat] },
      pricing: { ...gym.pricing, annualPass: details.annualPass },
      amenities: gym.amenities,
      equipmentTypes: gym.equipmentTypes,
      hours: gym.hours,
      operatingHours: details.operatingHours,
      capacity: { max: gym.capacity.max },
      equipment: details.equipment,
      trainers: details.trainers,
      classes: details.classes,
      addOns: details.addOns,
      policies: details.policies,
      contact: details.contact,
      rating: gym.rating,
      totalReviews: gym.totalReviews,
      ratingBreakdown: details.ratingBreakdown,
      isVerified: gym.isVerified,
      isFeatured: gym.isFeatured,
      isDemo: placement.isDemo,
      createdAt: now,
      updatedAt: now,
    };
    // Leave alone a listing that was handed to a real owner since the last run
    const existing = await gyms.findOne({ slug: gym.slug }, { projection: { ownerId: 1, isDemo: 1 } });
    if (existing && !existing.isDemo && !existing.ownerId.equals(placement.ownerId)) continue;
    // Status only on insert, so a studio an admin hid stays hidden
    const { createdAt, status, ...updatable } = doc;
    await gyms.updateOne({ slug: gym.slug }, { $set: updatable, $setOnInsert: { _id: new ObjectId(), createdAt, status } }, { upsert: true });
    const saved = (await gyms.findOne({ slug: gym.slug }))!;
    gymIds.push(saved._id);

    if (details.reviews.length > 0 && (await reviews.countDocuments({ gymId: saved._id })) === 0) {
      await reviews.insertMany(
        details.reviews.map((r) => ({
          _id: new ObjectId(),
          gymId: saved._id,
          userId: null,
          authorName: r.userName,
          authorImage: r.userAvatar ?? null,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          categories: r.categories,
          isVerified: r.isVerified,
          helpful: r.helpful,
          reply: r.gymResponse ? { text: r.gymResponse.response, at: new Date(r.gymResponse.date) } : undefined,
          createdAt: new Date(r.date),
        })),
      );
      // Keep the headline review count from the demo data, but refresh breakdowns
      const totals = { rating: saved.rating, totalReviews: saved.totalReviews };
      await refreshRating(saved._id);
      await gyms.updateOne({ _id: saved._id }, { $set: totals });
    }
  }
  return gymIds;
}
