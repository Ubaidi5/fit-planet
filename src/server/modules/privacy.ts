import "server-only";
import type { ObjectId } from "mongodb";
import { AppError } from "@/server/errors";
import { collections } from "@/server/db/collections";
import { getDb } from "@/server/db/client";
import { gymsManagedBy } from "@/server/modules/gyms";
import { keyFromUrl, storage } from "@/server/services/storage";
import { addDays, todayIn } from "@/lib/dates";
import { translatorFor } from "@/server/i18n";

export class PrivacyError extends AppError {}

/**
 * Everything Fit Planet stores about one person, as plain JSON (GDPR art. 15 and 20).
 * Secrets (password hash, push tokens, OAuth tokens) are left out.
 */
export async function exportAccount(userId: ObjectId) {
  const db = await getDb();
  const c = collections;
  const byUser = { userId };
  const [user, bookings, checkins, reviews, notifications, routines, workouts, posts, comments, likes, following, followers, media, devices, accounts, gyms] =
    await Promise.all([
      (await c.users()).findOne({ _id: userId }, { projection: { passwordHash: 0, passwordUnverified: 0, sessionsValidFrom: 0 } }),
      (await c.bookings()).find(byUser, { projection: { ownerId: 0, paymentRef: 0 } }).sort({ createdAt: -1 }).toArray(),
      (await c.checkins()).find(byUser, { projection: { byUserId: 0 } }).sort({ at: -1 }).toArray(),
      (await c.reviews()).find(byUser).sort({ createdAt: -1 }).toArray(),
      (await c.notifications()).find(byUser).sort({ createdAt: -1 }).toArray(),
      (await c.routines()).find(byUser).toArray(),
      (await c.workouts()).find(byUser).sort({ completedAt: -1 }).toArray(),
      (await c.posts()).find(byUser).sort({ createdAt: -1 }).toArray(),
      (await c.comments()).find(byUser).sort({ createdAt: -1 }).toArray(),
      (await c.likes()).find(byUser).toArray(),
      (await c.follows()).find({ followerId: userId }).toArray(),
      (await c.follows()).find({ followeeId: userId }).toArray(),
      (await c.media()).find({ ownerId: userId }, { projection: { url: 1, contentType: 1, size: 1, createdAt: 1 } }).toArray(),
      (await c.pushTokens()).find(byUser, { projection: { userAgent: 1, createdAt: 1, lastSeenAt: 1 } }).toArray(),
      db.collection("accounts").find({ userId }, { projection: { provider: 1, type: 1 } }).toArray(),
      gymsManagedBy(userId),
    ]);

  return {
    exportedAt: new Date().toISOString(),
    account: user,
    signInMethods: accounts.map((a) => ({ provider: a.provider, type: a.type })),
    bookings,
    checkins,
    reviews,
    notifications,
    routines,
    workouts,
    social: { posts, comments, likes, following, followers },
    uploads: media,
    devices,
    gyms: gyms.map((g) => ({ id: g._id, name: g.name, slug: g.slug, role: g.ownerId.equals(userId) ? "owner" : "staff" })),
  };
}

/** Why an account can't be deleted yet, or null when it can */
export async function deletionBlocker(userId: ObjectId): Promise<"runsGym" | "activePass" | null> {
  // Front-desk staff can leave; owners have to close or hand over the gym first
  if (await (await collections.gyms()).findOne({ ownerId: userId }, { projection: { _id: 1 } })) return "runsGym";
  // A day's slack covers gyms whose local date is behind UTC
  const since = addDays(todayIn("UTC"), -1);
  const active = await (await collections.bookings()).findOne({ userId, status: { $in: ["pending", "confirmed"] }, endDate: { $gte: since } });
  return active ? "activePass" : null;
}

/**
 * Erases an account (GDPR art. 17). Personal content goes; reviews stay on the
 * gym's page without a name, and bookings stay without contact details because
 * gyms need them for their accounts.
 */
export async function deleteAccount(userId: ObjectId) {
  const blocker = await deletionBlocker(userId);
  if (blocker) throw new PrivacyError(blocker === "runsGym" ? "deleteRunsGym" : "deleteActivePass");

  const db = await getDb();
  const c = collections;
  const users = await c.users();
  const user = await users.findOne({ _id: userId }, { projection: { email: 1 } });
  if (!user) return;

  // Social: own posts with their likes and comments, then traces on other people's posts
  const posts = await c.posts();
  const likes = await c.likes();
  const comments = await c.comments();
  const ownPostIds = (await posts.find({ userId }, { projection: { _id: 1 } }).toArray()).map((p) => p._id);
  await Promise.all([
    likes.deleteMany({ postId: { $in: ownPostIds } }),
    comments.deleteMany({ postId: { $in: ownPostIds } }),
    (await c.reports()).deleteMany({ $or: [{ postId: { $in: ownPostIds } }, { reporterId: userId }] }),
  ]);
  await posts.deleteMany({ userId });

  const likedPostIds = (await likes.find({ userId }, { projection: { postId: 1 } }).toArray()).map((l) => l.postId);
  if (likedPostIds.length) await posts.updateMany({ _id: { $in: likedPostIds } }, { $inc: { likeCount: -1 } });
  await likes.deleteMany({ userId });

  const commented = await comments.aggregate<{ _id: ObjectId; n: number }>([{ $match: { userId } }, { $group: { _id: "$postId", n: { $sum: 1 } } }]).toArray();
  if (commented.length) {
    await posts.bulkWrite(commented.map(({ _id, n }) => ({ updateOne: { filter: { _id }, update: { $inc: { commentCount: -n } } } })));
  }
  await comments.deleteMany({ userId });

  // Uploaded files, from storage as well as the index
  const media = await c.media();
  const files = await media.find({ ownerId: userId }, { projection: { key: 1, url: 1 } }).toArray();
  await Promise.all(
    files.map(async (file) => {
      const key = file.key || keyFromUrl(file.url);
      if (!key) return;
      try {
        await storage().delete(key);
      } catch (error) {
        console.error("[privacy] could not delete upload", key, error);
      }
    }),
  );

  const byUser = { userId };
  await Promise.all([
    media.deleteMany({ ownerId: userId }),
    (await c.follows()).deleteMany({ $or: [{ followerId: userId }, { followeeId: userId }] }),
    (await c.gyms()).updateMany({ staffIds: userId }, { $pull: { staffIds: userId } }),
    (await c.notifications()).deleteMany(byUser),
    (await c.pushTokens()).deleteMany(byUser),
    (await c.routines()).deleteMany(byUser),
    (await c.workouts()).deleteMany(byUser),
    // Reviews help other members, so they stay, without the name or photo
    (await c.reviews()).updateMany(byUser, { $set: { userId: null, authorName: "", authorImage: null } }),
    anonymiseBookings(userId),
    db.collection("accounts").deleteMany(byUser),
    db.collection("password_resets").deleteMany(byUser),
    user.email ? db.collection("verification_tokens").deleteMany({ identifier: user.email }) : Promise.resolve(),
  ]);

  await users.deleteOne({ _id: userId });
}

/** Bookings keep their numbers for the gym's books; the name reads "Former member" in the owner's language */
async function anonymiseBookings(userId: ObjectId) {
  const bookings = await collections.bookings();
  const ownerIds = await bookings.distinct("ownerId", { userId });
  if (!ownerIds.length) return;
  const owners = await (await collections.users()).find({ _id: { $in: ownerIds } }, { projection: { regionCode: 1 } }).toArray();
  await Promise.all(
    ownerIds.map(async (ownerId) => {
      const region = owners.find((o) => o._id.equals(ownerId))?.regionCode;
      const { t } = await translatorFor(region, "privacy");
      await bookings.updateMany({ userId, ownerId }, { $set: { guest: { name: t("formerMember"), email: null, phone: null } } });
    }),
  );
}
