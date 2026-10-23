import "server-only";
import type { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { BookingDoc, GymDoc } from "@/server/db/models";
import { addDays, todayIn } from "@/lib/dates";
import { notify } from "./notifications";

/** Reminders go out from this local hour onward, so nobody is woken at night */
const REMIND_FROM_HOUR = 17;
/** Online checkouts left unpaid this long are released */
const PENDING_TTL_MS = 2 * 60 * 60 * 1000;

function localHour(timeZone: string, now: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" }).format(now));
}

/**
 * Evening-before reminders: "your pass starts tomorrow" for bookings made in
 * advance, and "your pass ends tomorrow" for week and month passes. Run hourly;
 * each reminder is sent at most once per booking.
 */
export async function sendPassReminders(now = new Date()) {
  const bookings = await collections.bookings();
  const gyms = await collections.gyms();
  const users = await collections.users();

  // Gym timezones span roughly UTC-12..+14, so "tomorrow" anywhere is within two days of UTC today
  const utcToday = now.toISOString().slice(0, 10);
  const window = { $gte: utcToday, $lte: addDays(utcToday, 2) };
  const candidates = await bookings
    .find({
      status: "confirmed",
      $or: [
        { startDate: window, remindersSent: { $ne: "start" } },
        { endDate: window, remindersSent: { $ne: "end" } },
      ],
    })
    .limit(2000)
    .toArray();
  if (candidates.length === 0) return { sent: 0 };

  const gymIds = [...new Set(candidates.map((b) => b.gymId.toHexString()))];
  const gymDocs = await gyms.find({ _id: { $in: candidates.map((b) => b.gymId) } }, { projection: { name: 1, timezone: 1, slug: 1 } }).toArray();
  const gymById = new Map(gymDocs.map((g) => [g._id.toHexString(), g as Pick<GymDoc, "_id" | "name" | "timezone" | "slug">]));
  const userIds = [...new Set(candidates.map((b) => b.userId.toHexString()))];
  const optedOut = new Set(
    (await users.find({ _id: { $in: candidates.map((b) => b.userId) }, "notificationPrefs.passReminders": false }, { projection: { _id: 1 } }).toArray()).map((u) =>
      u._id.toHexString(),
    ),
  );

  let sent = 0;
  for (const booking of candidates) {
    const gym = gymById.get(booking.gymId.toHexString());
    if (!gym) continue;
    if (localHour(gym.timezone, now) < REMIND_FROM_HOUR) continue;
    const tomorrow = addDays(todayIn(gym.timezone, now), 1);
    const kind = reminderKind(booking, tomorrow);
    if (!kind) continue;

    // Claim the reminder first so overlapping runs can't double-send
    const claimed = await bookings.updateOne({ _id: booking._id, remindersSent: { $ne: kind } }, { $addToSet: { remindersSent: kind } });
    if (claimed.modifiedCount === 0) continue;
    if (optedOut.has(booking.userId.toHexString())) continue;

    await remind(booking.userId, booking, gym.name, kind);
    sent++;
  }
  return { sent, gyms: gymIds.length, users: userIds.length };
}

function reminderKind(booking: BookingDoc, tomorrow: string): "start" | "end" | null {
  const sent = booking.remindersSent ?? [];
  if (booking.startDate === tomorrow && !sent.includes("start")) return "start";
  // A day pass starts and ends on the same day; the start reminder covers it
  if (booking.endDate === tomorrow && booking.startDate !== booking.endDate && !sent.includes("end")) return "end";
  return null;
}

function remind(userId: ObjectId, booking: BookingDoc, gymName: string, kind: "start" | "end") {
  return notify(userId, {
    type: "pass.expiring",
    key: kind === "start" ? "passStarts" : "passEnds",
    params: { pass: booking.passType, gym: gymName },
    link: `/app/passes/${booking._id.toHexString()}`,
  });
}

/** Releases online bookings whose checkout was abandoned */
export async function releaseAbandonedCheckouts(now = new Date()) {
  const bookings = await collections.bookings();
  const result = await bookings.updateMany(
    { status: "pending", paymentMethod: "online", createdAt: { $lt: new Date(now.getTime() - PENDING_TTL_MS) } },
    { $set: { status: "cancelled", paymentStatus: "failed", cancelledAt: now } },
  );
  return { released: result.modifiedCount };
}
