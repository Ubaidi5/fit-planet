import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { CheckinDoc } from "@/server/db/models";
import type { BookingView, CheckinView } from "@/lib/types";
import { todayIn } from "@/lib/dates";
import { passMeta } from "@/lib/passes";
import { normalizePassCode, toBookingView, withGyms } from "./bookings";
import { notify } from "./notifications";

export type CheckinOutcome =
  | { ok: true; booking: BookingView; firstVisit: boolean; collectPayment: boolean }
  | { ok: false; reason: string; booking?: BookingView };

/**
 * Validates a pass code at the front desk and records the visit.
 * Day passes allow one entry; week and month passes allow one entry per day.
 */
export async function checkInByCode(params: {
  code: string;
  gymIds: ObjectId[];
  staffUserId: ObjectId;
  method: CheckinDoc["method"];
}): Promise<CheckinOutcome> {
  const bookings = await collections.bookings();
  const code = normalizePassCode(params.code);
  const doc = await bookings.findOne({ code });
  if (!doc) return { ok: false, reason: "No pass with that code." };

  const gym = await (await collections.gyms()).findOne({ _id: doc.gymId });
  if (!gym) return { ok: false, reason: "No pass with that code." };
  const view = toBookingView(doc, gym);

  if (!params.gymIds.some((id) => id.equals(doc.gymId))) {
    return { ok: false, reason: `This pass is for ${gym.name}, not your gym.`, booking: view };
  }
  if (doc.status === "pending") return { ok: false, reason: "This booking was never paid.", booking: view };
  if (doc.status === "cancelled" || doc.status === "refunded") return { ok: false, reason: "This booking was cancelled.", booking: view };

  const today = todayIn(gym.timezone);
  if (doc.startDate > today) return { ok: false, reason: `This pass starts on ${doc.startDate}.`, booking: view };
  if (doc.endDate < today) return { ok: false, reason: `This pass expired on ${doc.endDate}.`, booking: view };

  const checkins = await collections.checkins();
  const lastToday = doc.lastCheckinAt && todayIn(gym.timezone, doc.lastCheckinAt) === today;
  if (lastToday) {
    return {
      ok: false,
      reason: doc.passType === "day" ? "This day pass has already been used." : "Already checked in today.",
      booking: view,
    };
  }

  const now = new Date();
  // Guard against double scans racing each other
  const updated = await bookings.findOneAndUpdate(
    { _id: doc._id, lastCheckinAt: doc.lastCheckinAt ?? { $exists: false } },
    { $inc: { checkinCount: 1 }, $set: { lastCheckinAt: now } },
    { returnDocument: "after" },
  );
  if (!updated) return { ok: false, reason: "Already checked in.", booking: view };

  await checkins.insertOne({
    _id: new ObjectId(),
    bookingId: doc._id,
    gymId: doc.gymId,
    userId: doc.userId,
    byUserId: params.staffUserId,
    method: params.method,
    at: now,
  });

  const firstVisit = (await checkins.countDocuments({ userId: doc.userId, gymId: doc.gymId })) === 1;
  await notify(doc.userId, {
    type: "checkin",
    title: firstVisit ? `New stamp: ${gym.name}` : `Checked in at ${gym.name}`,
    body: firstVisit ? `Your passport just got a ${gym.address.city} stamp. Have a great session.` : "Have a great session.",
    link: "/app/checkins",
    silent: true,
  });

  return {
    ok: true,
    booking: toBookingView(updated, gym),
    firstVisit,
    collectPayment: updated.paymentMethod === "desk" && updated.paymentStatus !== "paid",
  };
}

export async function recentCheckins(filter: { gymIds?: ObjectId[]; userId?: ObjectId }, limit = 30): Promise<CheckinView[]> {
  const checkins = await collections.checkins();
  const query = filter.userId ? { userId: filter.userId } : { gymId: { $in: filter.gymIds ?? [] } };
  const docs = await checkins.find(query).sort({ at: -1 }).limit(limit).toArray();
  if (docs.length === 0) return [];

  const bookingDocs = await (await collections.bookings()).find({ _id: { $in: docs.map((d) => d.bookingId) } }).toArray();
  const bookingViews = new Map((await withGyms(bookingDocs)).map((b) => [b.id, b]));

  return docs.flatMap((doc) => {
    const booking = bookingViews.get(doc.bookingId.toHexString());
    if (!booking) return [];
    return [
      {
        id: doc._id.toHexString(),
        at: doc.at.toISOString(),
        method: doc.method,
        memberName: booking.guest.name,
        passType: booking.passType,
        bookingCode: booking.code,
        gym: { id: booking.gym.id, name: booking.gym.name, city: booking.gym.city, country: booking.gym.country, slug: booking.gym.slug },
      },
    ];
  });
}

/** Distinct gyms a member has trained at, for passport stamps */
export async function passportStamps(userId: ObjectId) {
  const checkins = await collections.checkins();
  const rows = await checkins
    .aggregate<{ _id: ObjectId; first: Date; visits: number }>([
      { $match: { userId } },
      { $group: { _id: "$gymId", first: { $min: "$at" }, visits: { $sum: 1 } } },
      { $sort: { first: -1 } },
    ])
    .toArray();
  if (rows.length === 0) return [];
  const gyms = await (await collections.gyms()).find({ _id: { $in: rows.map((r) => r._id) } }).toArray();
  const byId = new Map(gyms.map((g) => [g._id.toHexString(), g]));
  return rows.flatMap((row) => {
    const gym = byId.get(row._id.toHexString());
    if (!gym) return [];
    return [{ gymId: gym._id.toHexString(), slug: gym.slug, name: gym.name, city: gym.address.city, country: gym.country, first: row.first.toISOString(), visits: row.visits }];
  });
}

export function passLabel(type: keyof typeof passMeta) {
  return passMeta[type].label;
}
