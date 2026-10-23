import { AppError } from "@/server/errors";
import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { ReviewDoc, UserDoc } from "@/server/db/models";
import { notify } from "./notifications";
import { refreshRating, toReview } from "./gyms";

export class ReviewError extends AppError {}

export interface ReviewInput {
  rating: number;
  title: string;
  comment: string;
  categories: ReviewDoc["categories"];
}

/** Members who booked a gym can review it once; a check-in marks the review verified */
export async function upsertReview(user: UserDoc, gymId: ObjectId, input: ReviewInput) {
  const [bookings, checkins, reviews, gyms] = await Promise.all([
    collections.bookings(),
    collections.checkins(),
    collections.reviews(),
    collections.gyms(),
  ]);
  const gym = await gyms.findOne({ _id: gymId }, { projection: { ownerId: 1, name: 1, slug: 1 } });
  if (!gym) throw new ReviewError("gymNotFound");
  if (gym.ownerId.equals(user._id)) throw new ReviewError("ownGymReview");

  const booked = await bookings.findOne({ userId: user._id, gymId, status: { $in: ["confirmed", "expired"] } }, { projection: { _id: 1 } });
  if (!booked) throw new ReviewError("reviewNeedsBooking");
  const visited = await checkins.findOne({ userId: user._id, gymId }, { projection: { _id: 1 } });

  const existing = await reviews.findOne({ gymId, userId: user._id });
  const fields = {
    rating: input.rating,
    title: input.title.trim(),
    comment: input.comment.trim(),
    categories: input.categories,
    authorName: user.name ?? "Member",
    authorImage: user.image ?? null,
    isVerified: Boolean(visited),
  };
  if (existing) {
    await reviews.updateOne({ _id: existing._id }, { $set: fields });
  } else {
    await reviews.insertOne({ _id: new ObjectId(), gymId, userId: user._id, helpful: 0, createdAt: new Date(), ...fields });
    await notify(gym.ownerId, {
      type: "review.new",
      key: "reviewNew",
      params: { rating: input.rating, name: fields.authorName, gym: gym.name, title: fields.title },
      link: "/studio/reviews",
    });
  }
  await refreshRating(gymId);
}

export async function replyToReview(gymIds: ObjectId[], reviewId: ObjectId, text: string) {
  const reviews = await collections.reviews();
  const review = await reviews.findOneAndUpdate(
    { _id: reviewId, gymId: { $in: gymIds } },
    { $set: { reply: { text: text.trim(), at: new Date() } } },
    { returnDocument: "after" },
  );
  if (!review) throw new ReviewError("reviewNotFound");
  if (review.userId) {
    const gym = await (await collections.gyms()).findOne({ _id: review.gymId }, { projection: { name: 1, slug: 1 } });
    await notify(review.userId, {
      type: "review.reply",
      key: "reviewReply",
      params: { gym: gym?.name ?? "", text: text.slice(0, 140) },
      link: gym ? `/gyms/${gym.slug}?tab=reviews` : undefined,
      silent: true,
    });
  }
}

export async function listGymReviews(gymIds: ObjectId[], limit = 100) {
  const reviews = await collections.reviews();
  const docs = await reviews.find({ gymId: { $in: gymIds } }).sort({ createdAt: -1 }).limit(limit).toArray();
  return docs.map((doc) => ({ ...toReview(doc), gymId: doc.gymId.toHexString() }));
}
