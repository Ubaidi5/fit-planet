/**
 * End-to-end check of the booking flow against a real database, without the UI:
 * book (desk + mock online), confirm payment, check in, analytics, reviews.
 *   bun run test:smoke
 */
import assert from "node:assert/strict";
import { collections } from "@/server/db/collections";
import { getMongoClient } from "@/server/db/client";
import { createBooking, confirmOnlinePayment, listUserBookings } from "@/server/modules/bookings";
import { checkInByCode } from "@/server/modules/checkins";
import { ownerStats } from "@/server/modules/analytics";
import { listPublishedGyms, getPublicGymProfile, gymsManagedBy } from "@/server/modules/gyms";
import { upsertReview } from "@/server/modules/reviews";
import { listNotifications } from "@/server/modules/notifications";
import { sendPassReminders, releaseAbandonedCheckouts } from "@/server/modules/reminders";
import { copyTemplate, getRoutine, lastWeights, logWorkout } from "@/server/modules/routines";
import { addDays, todayIn } from "@/lib/dates";

async function main() {
  const users = await collections.users();
  const member = await users.findOne({ email: "member@fitplanet.dev" });
  const owner = await users.findOne({ email: "owner@fitplanet.dev" });
  assert(member && owner, "run db:seed first");

  const gyms = await listPublishedGyms();
  assert(gyms.length > 0, "gyms listed");
  const [home] = await gymsManagedBy(owner._id);
  const profile = await getPublicGymProfile(home.slug);
  assert(profile?.gym.name === home.name, "profile loads by slug");

  const today = todayIn(home.timezone);
  const desk = await createBooking({ user: member, gymId: home._id, passType: "day", startDate: today, paymentMethod: "desk" });
  assert(!desk.checkoutUrl, "desk booking needs no checkout");

  const online = await createBooking({ user: member, gymId: home._id, passType: "week", startDate: today, paymentMethod: "online" });
  assert(online.checkoutUrl?.includes("/checkout/mock"), "mock checkout url");
  const bookings = await collections.bookings();
  const pending = await bookings.findOne({ _id: new (await import("mongodb")).ObjectId(online.bookingId) });
  assert.equal(pending?.status, "pending");
  assert.equal(await confirmOnlinePayment(pending!._id), true, "confirms once");
  assert.equal(await confirmOnlinePayment(pending!._id), false, "second confirm is a no-op");

  const deskDoc = await bookings.findOne({ _id: new (await import("mongodb")).ObjectId(desk.bookingId) });
  const first = await checkInByCode({ code: deskDoc!.code.toLowerCase().replace(/-/g, " "), gymIds: [home._id], staffUserId: owner._id, method: "code" });
  assert(first.ok, `check-in ok: ${!first.ok && first.reason}`);
  assert(first.ok && first.collectPayment, "desk payment flagged");
  const second = await checkInByCode({ code: deskDoc!.code, gymIds: [home._id], staffUserId: owner._id, method: "qr" });
  assert(!second.ok, "day pass can't be reused");

  const otherGym = gyms.find((g) => g.id !== home._id.toHexString())!;
  const wrong = await checkInByCode({ code: pending!.code, gymIds: [new (await import("mongodb")).ObjectId(otherGym.id)], staffUserId: owner._id, method: "code" });
  assert(!wrong.ok && wrong.reason.includes("not your gym"), "wrong gym rejected");

  const stats = await ownerStats([home]);
  assert(stats.todayBookings >= 2 && stats.occupancy.current >= 1, "stats reflect new activity");

  await upsertReview(member, home._id, { rating: 5, title: "Great floor", comment: "Clean, friendly and not too busy.", categories: { cleanliness: 5, equipment: 4, staff: 5, value: 4 } });

  const ownerFeed = await listNotifications(owner._id);
  assert(ownerFeed.some((n) => n.type === "booking.new"), "owner notified of booking");
  const mine = await listUserBookings(member._id);
  assert(mine.some((b) => b.isActive), "member has an active pass");

  // Evening-before reminder: pick a moment today, 17:00 or later in the gym's timezone
  const ahead = await createBooking({ user: member, gymId: home._id, passType: "day", startDate: addDays(today, 1), paymentMethod: "desk" });
  const hourIn = (d: Date) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: home.timezone, hour: "2-digit", hourCycle: "h23" }).format(d));
  let evening = new Date();
  while (hourIn(evening) < 17) evening = new Date(evening.getTime() + 60 * 60 * 1000);
  assert.equal(todayIn(home.timezone, evening), today, "evening is still today");
  await sendPassReminders(evening);
  const aheadDoc = await bookings.findOne({ _id: new (await import("mongodb")).ObjectId(ahead.bookingId) });
  assert.deepEqual(aheadDoc?.remindersSent, ["start"], "start reminder recorded");
  const memberFeed = await listNotifications(member._id);
  assert(memberFeed.some((n) => n.type === "pass.expiring" && n.title.includes("starts tomorrow")), "member reminded");
  const before = memberFeed.filter((n) => n.type === "pass.expiring").length;
  await sendPassReminders(evening);
  assert.equal((await listNotifications(member._id)).filter((n) => n.type === "pass.expiring").length, before, "reminder not repeated");

  const stale = await createBooking({ user: member, gymId: home._id, passType: "day", startDate: today, paymentMethod: "online" });
  await releaseAbandonedCheckouts(new Date(Date.now() + 3 * 60 * 60 * 1000));
  const staleDoc = await bookings.findOne({ _id: new (await import("mongodb")).ObjectId(stale.bookingId) });
  assert.equal(staleDoc?.status, "cancelled", "abandoned checkout released");

  // Routines: copy a template, log a workout, prefill from it next time
  const routineId = await copyTemplate(member._id, "tpl-push");
  const routine = (await getRoutine(member._id, routineId))!;
  const workoutId = await logWorkout(member._id, {
    routineId,
    startedAt: new Date(Date.now() - 50 * 60_000),
    exercises: routine.items.map((item) => ({ exerciseId: item.exerciseId, sets: [{ reps: 8, weight: 60, done: true }, { reps: 8, weight: 65, done: true }, { reps: 0, weight: null, done: false }] })),
  });
  const workoutDoc = await (await collections.workouts()).findOne({ _id: workoutId });
  assert.equal(workoutDoc?.setsDone, routine.items.length * 2, "only completed sets count");
  assert.equal(workoutDoc?.volumeKg, routine.items.length * (8 * 60 + 8 * 65), "volume is reps x weight");
  assert.equal((await getRoutine(member._id, routineId))?.timesCompleted, 1, "routine counter bumped");
  assert.equal((await lastWeights(member._id, [routine.items[0].exerciseId]))[routine.items[0].exerciseId], 65, "heaviest set prefilled");

  console.log("✓ smoke test passed", { todayBookings: stats.todayBookings, occupancy: stats.occupancy, ownerNotifications: ownerFeed.length });
  await (await getMongoClient()).close();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
