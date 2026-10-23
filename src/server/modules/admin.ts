import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { AppError } from "@/server/errors";
import { collections } from "@/server/db/collections";
import type { AdminLogDoc, GymDoc, PostDoc, UserDoc } from "@/server/db/models";
import { notify } from "@/server/modules/notifications";

export class AdminError extends AppError {}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function log(adminId: ObjectId, action: string, targetType: AdminLogDoc["targetType"], targetId: ObjectId, note?: string) {
  await (await collections.adminLog()).insertOne({ _id: new ObjectId(), adminId, action, targetType, targetId, note, at: new Date() });
}

/** Headline numbers for the console's front page */
export async function adminOverview() {
  const since = new Date(Date.now() - 30 * 86_400_000);
  const [users, newUsers, gyms, bookings, revenue, openReports, recent] = await Promise.all([
    (await collections.users()).estimatedDocumentCount(),
    (await collections.users()).countDocuments({ createdAt: { $gte: since } }),
    (await collections.gyms()).aggregate<{ _id: GymDoc["status"]; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    (await collections.bookings()).countDocuments({ createdAt: { $gte: since }, status: { $in: ["confirmed", "expired"] } }),
    (await collections.bookings())
      .aggregate<{ _id: string; total: number }>([
        { $match: { createdAt: { $gte: since }, paymentStatus: "paid" } },
        { $group: { _id: "$currency", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ])
      .toArray(),
    (await collections.reports()).distinct("postId").then((ids) => ids.length),
    (await collections.adminLog()).find().sort({ at: -1 }).limit(8).toArray(),
  ]);
  const byStatus = Object.fromEntries(gyms.map((g) => [g._id, g.n])) as Partial<Record<GymDoc["status"], number>>;
  const admins = await (await collections.users())
    .find({ _id: { $in: [...new Set(recent.map((r) => r.adminId.toHexString()))].map((id) => new ObjectId(id)) } }, { projection: { name: 1, email: 1 } })
    .toArray();
  return {
    users,
    newUsers,
    gyms: { published: byStatus.published ?? 0, draft: byStatus.draft ?? 0, suspended: byStatus.suspended ?? 0 },
    bookings,
    revenue: revenue.map((r) => ({ currency: r._id, total: r.total })),
    openReports,
    recent: recent.map((r) => ({ ...r, adminName: admins.find((a) => a._id.equals(r.adminId))?.name ?? "Admin" })),
  };
}

export type GymFilter = "all" | "published" | "draft" | "suspended" | "unverified";

export async function adminGyms(filter: GymFilter, q: string) {
  const query: Filter<GymDoc> = {};
  if (filter === "unverified") Object.assign(query, { status: "published", isVerified: false });
  else if (filter !== "all") query.status = filter;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    query.$or = [{ name: pattern }, { "address.city": pattern }, { slug: pattern }];
  }
  const gyms = await (await collections.gyms()).find(query).sort({ createdAt: -1 }).limit(100).toArray();
  const owners = await (await collections.users()).find({ _id: { $in: gyms.map((g) => g.ownerId) } }, { projection: { name: 1, email: 1 } }).toArray();
  return gyms.map((g) => ({ gym: g, owner: owners.find((o) => o._id.equals(g.ownerId)) ?? null }));
}

export type GymModeration = "verify" | "unverify" | "feature" | "unfeature" | "suspend" | "restore";

export async function moderateGym(admin: UserDoc, gymId: ObjectId, action: GymModeration, note?: string) {
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  const now = new Date();
  const changes: Record<GymModeration, Partial<GymDoc>> = {
    verify: { isVerified: true },
    unverify: { isVerified: false },
    feature: { isFeatured: true },
    unfeature: { isFeatured: false },
    suspend: { status: "suspended", isFeatured: false },
    // Back to draft: the owner checks the listing and publishes it again
    restore: { status: "draft" },
  };
  await gyms.updateOne({ _id: gymId }, { $set: { ...changes[action], updatedAt: now } });
  await log(admin._id, `gym.${action}`, "gym", gymId, note);

  const link = "/studio/profile";
  if (action === "verify") await notify(gym.ownerId, { type: "system", key: "gymVerified", params: { gym: gym.name }, link });
  if (action === "suspend") await notify(gym.ownerId, { type: "system", key: "gymSuspended", params: { gym: gym.name }, link });
  if (action === "restore") await notify(gym.ownerId, { type: "system", key: "gymRestored", params: { gym: gym.name }, link });
}

/** Reported posts, most reported first, with the post and its author */
export async function reportQueue() {
  const groups = await (await collections.reports())
    .aggregate<{ _id: ObjectId; count: number; reasons: string[]; last: Date }>([
      { $group: { _id: "$postId", count: { $sum: 1 }, reasons: { $push: "$reason" }, last: { $max: "$createdAt" } } },
      { $sort: { count: -1, last: -1 } },
      { $limit: 50 },
    ])
    .toArray();
  const posts = await (await collections.posts()).find({ _id: { $in: groups.map((g) => g._id) } }).toArray();
  const authors = await (await collections.users())
    .find({ _id: { $in: posts.map((p) => p.userId) } }, { projection: { name: 1, handle: 1, email: 1, suspendedAt: 1 } })
    .toArray();
  return groups.map((g) => {
    const post: PostDoc | null = posts.find((p) => p._id.equals(g._id)) ?? null;
    return {
      postId: g._id,
      count: g.count,
      reasons: [...new Set(g.reasons.filter(Boolean))].slice(0, 5),
      last: g.last,
      post,
      author: post ? (authors.find((a) => a._id.equals(post.userId)) ?? null) : null,
    };
  });
}

export async function resolveReport(admin: UserDoc, postId: ObjectId, action: "remove" | "dismiss") {
  const reports = await collections.reports();
  if (action === "remove") {
    const posts = await collections.posts();
    const post = await posts.findOneAndDelete({ _id: postId });
    if (post) {
      await Promise.all([(await collections.likes()).deleteMany({ postId }), (await collections.comments()).deleteMany({ postId })]);
      await notify(post.userId, { type: "system", key: "postRemoved", link: "/terms#community" });
    }
  }
  await reports.deleteMany({ postId });
  await log(admin._id, `report.${action}`, "post", postId);
}

export async function adminUsers(q: string, suspendedOnly: boolean) {
  const query: Filter<UserDoc> = {};
  if (suspendedOnly) query.suspendedAt = { $exists: true };
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    query.$or = [{ email: pattern }, { name: pattern }, { handle: pattern }];
  }
  return (await collections.users())
    .find(query, { projection: { name: 1, email: 1, handle: 1, roles: 1, createdAt: 1, suspendedAt: 1, regionCode: 1 } })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
}

export async function setUserSuspended(admin: UserDoc, userId: ObjectId, suspended: boolean, note?: string) {
  if (admin._id.equals(userId)) throw new AdminError("cannotSuspendSelf");
  const users = await collections.users();
  const now = new Date();
  // Suspending also ends every session the account has open
  const result = await users.updateOne(
    { _id: userId },
    suspended ? { $set: { suspendedAt: now, sessionsValidFrom: now, updatedAt: now } } : { $unset: { suspendedAt: "" }, $set: { updatedAt: now } },
  );
  if (!result.matchedCount) throw new AdminError("accountNotFound");
  if (suspended) await (await collections.pushTokens()).deleteMany({ userId });
  await log(admin._id, suspended ? "user.suspend" : "user.restore", "user", userId, note);
}
