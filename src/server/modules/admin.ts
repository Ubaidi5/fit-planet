import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { AppError } from "@/server/errors";
import { collections } from "@/server/db/collections";
import type { AdminLogDoc, BookingDoc, GymDoc, PostDoc, UserDoc } from "@/server/db/models";
import { notify } from "@/server/modules/notifications";
import { paymentProvider } from "@/server/services/payments";
import { addDays } from "@/lib/dates";
import { env } from "@/server/env";
import { email } from "@/server/services/email";
import { restoredEmail, suspendedEmail } from "@/server/services/email/templates";
import { translatorFor } from "@/server/i18n";
import { reasonLabel, type SuspensionReason } from "@/lib/suspension";

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

export type GymFilter = "all" | "published" | "draft" | "suspended" | "unverified" | "demo";

export async function adminGyms(filter: GymFilter, q: string) {
  const query: Filter<GymDoc> = {};
  if (filter === "unverified") Object.assign(query, { status: "published", isVerified: false });
  else if (filter === "demo") query.isDemo = true;
  else if (filter !== "all") query.status = filter;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    query.$or = [{ name: pattern }, { "address.city": pattern }, { slug: pattern }];
  }
  const gyms = await (await collections.gyms()).find(query).sort({ createdAt: -1 }).limit(100).toArray();
  const owners = await (await collections.users()).find({ _id: { $in: gyms.map((g) => g.ownerId) } }, { projection: { name: 1, email: 1 } }).toArray();
  return gyms.map((g) => ({ gym: g, owner: owners.find((o) => o._id.equals(g.ownerId)) ?? null }));
}

export type GymModeration = "verify" | "unverify" | "feature" | "unfeature" | "hide" | "publish" | "restore";

export interface SuspensionInput {
  reason: SuspensionReason;
  /** Required when the reason is "other" */
  details?: string;
}

/** The reason as it reads in the audit log */
const logNote = (input: SuspensionInput) => [input.reason === "other" ? null : reasonLabel(input.reason), input.details].filter(Boolean).join(": ");

/**
 * Emails never block a moderation step: the change is already saved and logged,
 * so a mail outage is reported but doesn't undo it.
 */
async function sendQuietly(send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error("[admin] email failed", error);
  }
}

async function emailSuspension(to: { email?: string | null; regionCode?: string }, input: SuspensionInput, gym?: string) {
  if (!to.email) return;
  const { t } = await translatorFor(to.regionCode, "email");
  const reason = input.reason === "other" ? (input.details ?? "") : input.details ? `${t(`reasons.${input.reason}`)}. ${input.details}` : t(`reasons.${input.reason}`);
  await sendQuietly(() => email().send(suspendedEmail(to.email!, { gym, reason }, t)));
}

async function emailRestore(to: { email?: string | null; regionCode?: string }, gym?: string) {
  if (!to.email) return;
  const { t } = await translatorFor(to.regionCode, "email");
  const url = `${env.appUrl}${gym ? "/studio/profile" : "/login"}`;
  await sendQuietly(() => email().send(restoredEmail(to.email!, { gym, url }, t)));
}

export async function moderateGym(admin: UserDoc, gymId: ObjectId, action: GymModeration, note?: string) {
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  if (action === "publish" && gym.images.length === 0) throw new AdminError("addPhotoFirst");
  const now = new Date();
  const changes: Record<GymModeration, Partial<GymDoc>> = {
    verify: { isVerified: true },
    unverify: { isVerified: false },
    feature: { isFeatured: true },
    unfeature: { isFeatured: false },
    // Hidden listings go back to draft: off the site, but nothing is lost
    hide: { status: "draft", isFeatured: false },
    publish: { status: "published" },
    // Back to draft: the owner checks the listing and publishes it again
    restore: { status: "draft" },
  };
  await gyms.updateOne(
    { _id: gymId },
    action === "restore" ? { $set: { ...changes.restore, updatedAt: now }, $unset: { suspension: "" } } : { $set: { ...changes[action], updatedAt: now } },
  );
  await log(admin._id, `gym.${action}`, "gym", gymId, note);

  // Sample studios have no real owner to tell
  if (gym.isDemo) return;
  const link = "/studio/profile";
  if (action === "verify") await notify(gym.ownerId, { type: "system", key: "gymVerified", params: { gym: gym.name }, link });
  if (action === "restore") {
    await notify(gym.ownerId, { type: "system", key: "gymRestored", params: { gym: gym.name }, link });
    const owner = await (await collections.users()).findOne({ _id: gym.ownerId }, { projection: { email: 1, regionCode: 1 } });
    if (owner) await emailRestore(owner, gym.name);
  }
}

/** Hides a studio from the site with a reason, and tells the owner in the app and by email */
export async function suspendGym(admin: UserDoc, gymId: ObjectId, input: SuspensionInput) {
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  const now = new Date();
  await gyms.updateOne(
    { _id: gymId },
    { $set: { status: "suspended", isFeatured: false, suspension: { ...input, at: now, by: admin._id }, updatedAt: now } },
  );
  await log(admin._id, "gym.suspend", "gym", gymId, logNote(input));
  if (gym.isDemo) return;
  await notify(gym.ownerId, { type: "system", key: "gymSuspended", params: { gym: gym.name }, link: "/studio/profile" });
  const owner = await (await collections.users()).findOne({ _id: gym.ownerId }, { projection: { email: 1, regionCode: 1 } });
  if (owner) await emailSuspension(owner, input, gym.name);
}

/** Everything that only exists because of the given studios */
async function eraseGyms(gymIds: ObjectId[]) {
  await Promise.all([
    (await collections.reviews()).deleteMany({ gymId: { $in: gymIds } }),
    (await collections.checkins()).deleteMany({ gymId: { $in: gymIds } }),
    (await collections.bookings()).deleteMany({ gymId: { $in: gymIds } }),
    (await collections.staffInvites()).deleteMany({ gymId: { $in: gymIds } }),
    (await collections.users()).updateMany({ savedGymIds: { $in: gymIds } }, { $pull: { savedGymIds: { $in: gymIds } } as never }),
  ]);
  await (await collections.gyms()).deleteMany({ _id: { $in: gymIds } });
}

/**
 * Deletes a studio for good. Real studios with passes sold keep their records
 * for members and accounting, so those can only be hidden or suspended.
 */
export async function deleteGym(admin: UserDoc, gymId: ObjectId) {
  const gym = await (await collections.gyms()).findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  if (!gym.isDemo && (await (await collections.bookings()).countDocuments({ gymId, status: { $in: ["confirmed", "expired", "refunded"] } })) > 0) {
    throw new AdminError("gymHasBookings");
  }
  await eraseGyms([gymId]);
  await log(admin._id, "gym.delete", "gym", gymId, gym.name);
  return gym;
}

/** Removes every sample studio loaded by scripts/demo-studios.ts */
export async function deleteDemoGyms(admin: UserDoc) {
  const ids = await (await collections.gyms()).distinct("_id", { isDemo: true });
  if (!ids.length) return 0;
  await eraseGyms(ids);
  await log(admin._id, "gym.deleteDemo", "gym", admin._id, `${ids.length} sample studios`);
  return ids.length;
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
    .find(query, { projection: { name: 1, email: 1, handle: 1, roles: 1, createdAt: 1, suspendedAt: 1, suspension: 1, regionCode: 1 } })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
}

/** Suspends an account with a reason, or lifts it with `null`. Either way the person gets an email. */
export async function setUserSuspended(admin: UserDoc, userId: ObjectId, suspension: SuspensionInput | null) {
  if (admin._id.equals(userId)) throw new AdminError("cannotSuspendSelf");
  const users = await collections.users();
  const now = new Date();
  // Suspending also ends every session the account has open
  const user = await users.findOneAndUpdate(
    { _id: userId },
    suspension
      ? { $set: { suspendedAt: now, suspension: { ...suspension, at: now, by: admin._id }, sessionsValidFrom: now, updatedAt: now } }
      : { $unset: { suspendedAt: "", suspension: "" }, $set: { updatedAt: now } },
    { projection: { email: 1, regionCode: 1 } },
  );
  if (!user) throw new AdminError("accountNotFound");
  if (suspension) {
    await (await collections.pushTokens()).deleteMany({ userId });
    await log(admin._id, "user.suspend", "user", userId, logNote(suspension));
    await emailSuspension(user, suspension);
  } else {
    await log(admin._id, "user.restore", "user", userId);
    await emailRestore(user);
  }
}

/** Last admin actions taken on one record, newest first, with the admin's name */
async function historyFor(targetId: ObjectId) {
  const entries = await (await collections.adminLog()).find({ targetId }).sort({ at: -1 }).limit(20).toArray();
  const admins = await (await collections.users())
    .find({ _id: { $in: entries.map((e) => e.adminId) } }, { projection: { name: 1, email: 1 } })
    .toArray();
  return entries.map((e) => ({ ...e, adminName: admins.find((a) => a._id.equals(e.adminId))?.name ?? "Admin" }));
}

/** Everything an admin needs to judge one account */
export async function adminUserDetail(userId: ObjectId) {
  const user = await (await collections.users()).findOne({ _id: userId }, { projection: { passwordHash: 0 } });
  if (!user) return null;
  const [bookings, gyms, posts, workouts, followers, following, spend, history] = await Promise.all([
    (await collections.bookings()).find({ userId }).sort({ createdAt: -1 }).limit(20).toArray(),
    (await collections.gyms())
      .find({ $or: [{ ownerId: userId }, { staffIds: userId }] }, { projection: { name: 1, slug: 1, status: 1, ownerId: 1, address: 1 } })
      .toArray(),
    (await collections.posts()).countDocuments({ userId }),
    (await collections.workouts()).countDocuments({ userId }),
    (await collections.follows()).countDocuments({ followeeId: userId }),
    (await collections.follows()).countDocuments({ followerId: userId }),
    (await collections.bookings())
      .aggregate<{ _id: string; total: number }>([
        { $match: { userId, paymentStatus: "paid" } },
        { $group: { _id: "$currency", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ])
      .toArray(),
    historyFor(userId),
  ]);
  const bookingGyms = await (await collections.gyms())
    .find({ _id: { $in: bookings.map((b) => b.gymId) } }, { projection: { name: 1 } })
    .toArray();
  return {
    user,
    bookings: bookings.map((b) => ({ booking: b, gymName: bookingGyms.find((g) => g._id.equals(b.gymId))?.name ?? "Removed gym" })),
    gyms: gyms.map((g) => ({ gym: g, role: g.ownerId.equals(userId) ? ("owner" as const) : ("staff" as const) })),
    counts: { posts, workouts, followers, following },
    spend: spend.map((s) => ({ currency: s._id, total: s.total })),
    history,
  };
}

/** Grants or removes platform admin access. ADMIN_EMAILS accounts stay admins whatever the role says. */
export async function setUserAdmin(admin: UserDoc, userId: ObjectId, grant: boolean) {
  if (admin._id.equals(userId)) throw new AdminError("cannotChangeOwnAccess");
  const users = await collections.users();
  const now = new Date();
  const result = await users.updateOne(
    { _id: userId },
    grant
      ? { $addToSet: { roles: "admin" }, $set: { updatedAt: now } }
      : // Removing access also signs the account out, so an open console tab stops working
        { $pull: { roles: "admin" }, $set: { sessionsValidFrom: now, updatedAt: now } },
  );
  if (!result.matchedCount) throw new AdminError("accountNotFound");
  await log(admin._id, grant ? "user.grantAdmin" : "user.revokeAdmin", "user", userId);
}

/** One studio with its people, numbers and recent bookings */
export async function adminGymDetail(gymId: ObjectId) {
  const gym = await (await collections.gyms()).findOne({ _id: gymId });
  if (!gym) return null;
  const since = new Date(Date.now() - 30 * 86_400_000);
  const [people, recent, totals, last30, checkins30, history] = await Promise.all([
    (await collections.users())
      .find({ _id: { $in: [gym.ownerId, ...(gym.staffIds ?? [])] } }, { projection: { name: 1, email: 1, handle: 1, suspendedAt: 1 } })
      .toArray(),
    (await collections.bookings()).find({ gymId }).sort({ createdAt: -1 }).limit(15).toArray(),
    (await collections.bookings())
      .aggregate<{ _id: null; bookings: number; paid: number }>([
        { $match: { gymId, status: { $in: ["confirmed", "expired", "refunded"] } } },
        { $group: { _id: null, bookings: { $sum: 1 }, paid: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$amount", 0] } } } },
      ])
      .toArray(),
    (await collections.bookings())
      .aggregate<{ _id: null; bookings: number; paid: number }>([
        { $match: { gymId, createdAt: { $gte: since }, status: { $in: ["confirmed", "expired", "refunded"] } } },
        { $group: { _id: null, bookings: { $sum: 1 }, paid: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$amount", 0] } } } },
      ])
      .toArray(),
    (await collections.checkins()).countDocuments({ gymId, at: { $gte: since } }),
    historyFor(gymId),
  ]);
  return {
    gym,
    owner: people.find((p) => p._id.equals(gym.ownerId)) ?? null,
    staff: people.filter((p) => !p._id.equals(gym.ownerId)),
    recent,
    stats: {
      bookings: totals[0]?.bookings ?? 0,
      paid: totals[0]?.paid ?? 0,
      bookings30: last30[0]?.bookings ?? 0,
      paid30: last30[0]?.paid ?? 0,
      checkins30,
    },
    history,
  };
}

export interface AdminGymEdit {
  name: string;
  description: string;
  street: string;
  area: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity: number;
  dayPass: number;
  weekPass: number;
  monthPass: number;
}

/** Corrects a listing's core details for an owner. The slug stays, so shared links keep working. */
export async function adminUpdateGym(admin: UserDoc, gymId: ObjectId, input: AdminGymEdit, note?: string) {
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  await gyms.updateOne(
    { _id: gymId },
    {
      $set: {
        name: input.name,
        description: input.description,
        address: { street: input.street, area: input.area, city: input.city },
        contact: { ...gym.contact, phone: input.phone || undefined, email: input.email || undefined, website: input.website || undefined },
        "capacity.max": input.capacity,
        pricing: { ...gym.pricing, dayPass: input.dayPass, weekPass: input.weekPass, monthPass: input.monthPass },
        updatedAt: new Date(),
      },
    },
  );
  await log(admin._id, "gym.edit", "gym", gymId, note);
  return gym.slug;
}

/** Hands a studio to another existing account, e.g. when a gym is sold or the wrong person signed it up */
export async function transferGym(admin: UserDoc, gymId: ObjectId, newOwnerEmail: string) {
  const gyms = await collections.gyms();
  const users = await collections.users();
  const gym = await gyms.findOne({ _id: gymId });
  if (!gym) throw new AdminError("gymNotFound");
  const next = await users.findOne({ email: newOwnerEmail.toLowerCase() });
  if (!next) throw new AdminError("accountNotFound");
  if (next._id.equals(gym.ownerId)) return;
  const now = new Date();
  // The old owner stays on as staff so the front desk keeps working until the new owner decides
  // One $set, since Mongo refuses $addToSet and $pull on the same array in a single update
  const staffIds = [...(gym.staffIds ?? []).filter((id) => !id.equals(next._id) && !id.equals(gym.ownerId)), gym.ownerId];
  // A sample studio handed to a real owner becomes a real listing
  await gyms.updateOne({ _id: gymId }, { $set: { ownerId: next._id, staffIds, updatedAt: now }, $unset: { isDemo: "" } });
  await users.updateOne({ _id: next._id }, { $addToSet: { roles: "owner" }, $set: { updatedAt: now } });
  await log(admin._id, "gym.transfer", "gym", gymId, `to ${next.email}`);
  await notify(next._id, { type: "system", key: "gymTransferred", params: { gym: gym.name }, link: "/studio/profile" });
}

export type BookingFilter = "all" | "paid" | "desk" | "refunded" | "cancelled" | "failed";

export async function adminBookings(filter: BookingFilter, q: string) {
  const query: Filter<BookingDoc> = {};
  if (filter === "paid") query.paymentStatus = "paid";
  if (filter === "desk") Object.assign(query, { paymentMethod: "desk", paymentStatus: "unpaid", status: "confirmed" });
  if (filter === "refunded") query.paymentStatus = "refunded";
  if (filter === "cancelled") query.status = "cancelled";
  if (filter === "failed") query.paymentStatus = "failed";
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    query.$or = [{ code: pattern }, { "guest.name": pattern }, { "guest.email": pattern }, { paymentRef: pattern }];
  }
  const rows = await (await collections.bookings()).find(query).sort({ createdAt: -1 }).limit(100).toArray();
  const gyms = await (await collections.gyms())
    .find({ _id: { $in: rows.map((b) => b.gymId) } }, { projection: { name: 1 } })
    .toArray();
  return rows.map((b) => ({ booking: b, gymName: gyms.find((g) => g._id.equals(b.gymId))?.name ?? "Removed gym" }));
}

/** Cancels a confirmed pass on the platform's behalf, refunding it when it was paid online */
export async function adminCancelBooking(admin: UserDoc, bookingId: ObjectId, note?: string) {
  const bookings = await collections.bookings();
  const doc = await bookings.findOne({ _id: bookingId });
  if (!doc || doc.status !== "confirmed") throw new AdminError("onlyConfirmedCancel");
  let refunded = false;
  if (doc.paymentStatus === "paid" && doc.paymentMethod === "online" && doc.paymentProvider && doc.paymentRef) {
    await paymentProvider(doc.paymentProvider)?.refund(doc.paymentRef);
    refunded = true;
  }
  await bookings.updateOne(
    { _id: doc._id },
    { $set: { status: refunded ? "refunded" : "cancelled", paymentStatus: refunded ? "refunded" : doc.paymentStatus, cancelledAt: new Date() } },
  );
  await log(admin._id, refunded ? "booking.refund" : "booking.cancel", "booking", doc._id, note);
  const gym = await (await collections.gyms()).findOne({ _id: doc.gymId }, { projection: { name: 1 } });
  const params = { gym: gym?.name ?? "", pass: doc.passType, startDate: doc.startDate, refunded: refunded ? "yes" : "no" };
  await notify(doc.userId, { type: "booking.cancelled", key: "bookingCancelledByGym", params, link: `/app/passes/${doc._id.toHexString()}` });
}

export interface GrowthPoint {
  date: string;
  signups: number;
  bookings: number;
}

/** Daily sign-ups and passes over the last 30 days (UTC), and the busiest studios */
export async function adminGrowth() {
  const today = new Date().toISOString().slice(0, 10);
  const from = addDays(today, -29);
  const since = new Date(`${from}T00:00:00Z`);
  const byDay = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
  const [signups, passes, top] = await Promise.all([
    (await collections.users()).aggregate<{ _id: string; n: number }>([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: byDay, n: { $sum: 1 } } }]).toArray(),
    (await collections.bookings())
      .aggregate<{ _id: string; n: number }>([
        { $match: { createdAt: { $gte: since }, status: { $in: ["confirmed", "expired", "refunded"] } } },
        { $group: { _id: byDay, n: { $sum: 1 } } },
      ])
      .toArray(),
    (await collections.bookings())
      .aggregate<{ _id: ObjectId; n: number }>([
        { $match: { createdAt: { $gte: since }, status: { $in: ["confirmed", "expired"] } } },
        { $group: { _id: "$gymId", n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 5 },
      ])
      .toArray(),
  ]);
  const series: GrowthPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(from, i);
    return { date, signups: signups.find((s) => s._id === date)?.n ?? 0, bookings: passes.find((p) => p._id === date)?.n ?? 0 };
  });
  const gyms = await (await collections.gyms())
    .find({ _id: { $in: top.map((t) => t._id) } }, { projection: { name: 1, address: 1 } })
    .toArray();
  return {
    series,
    topGyms: top.flatMap((t) => {
      const gym = gyms.find((g) => g._id.equals(t._id));
      return gym ? [{ id: gym._id.toHexString(), name: gym.name, city: gym.address.city, passes: t.n }] : [];
    }),
  };
}
