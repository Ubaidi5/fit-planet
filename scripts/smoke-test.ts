/**
 * End-to-end check of the booking flow against a real database, without the UI:
 * book (desk + mock online), confirm payment, check in, analytics, reviews.
 *   bun run test:smoke
 */
import assert from "node:assert/strict";
import { collections } from "@/server/db/collections";
import { getMongoClient } from "@/server/db/client";
import { createBooking, confirmOnlinePayment, listUserBookings, refundOrphanedPayment } from "@/server/modules/bookings";
import { mockProvider } from "@/server/services/payments/mock";
import { checkInByCode } from "@/server/modules/checkins";
import { ownerStats } from "@/server/modules/analytics";
import { listPublishedGyms, getPublicGymProfile, gymsManagedBy } from "@/server/modules/gyms";
import { upsertReview } from "@/server/modules/reviews";
import { listNotifications } from "@/server/modules/notifications";
import { sendPassReminders, releaseAbandonedCheckouts } from "@/server/modules/reminders";
import { copyTemplate, getRoutine, lastWeights, logWorkout } from "@/server/modules/routines";
import { addComment, ensureHandle, feed, follow, reportPost, shareWorkout, toggleLike, updateSocialProfile } from "@/server/modules/social";
import { addDays, todayIn } from "@/lib/dates";
import { createHash, randomBytes } from "node:crypto";
import { registerWithPassword } from "@/server/modules/users";
import { acceptInvite, inviteStaff } from "@/server/modules/team";
import {
  adminBookings,
  adminCancelBooking,
  adminGrowth,
  adminGymDetail,
  adminUpdateGym,
  adminUserDetail,
  deleteGym,
  moderateGym,
  setUserAdmin,
  setUserSuspended,
  suspendGym,
  transferGym,
} from "@/server/modules/admin";
import { ObjectId } from "mongodb";
import { deleteAccount, deletionBlocker, exportAccount } from "@/server/modules/privacy";

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
  // Another gym's code reads as unknown, so staff can't learn about other gyms' members
  assert(!wrong.ok && wrong.reason === "noSuchPass" && !("booking" in wrong && wrong.booking), "wrong gym rejected without details");

  const stats = await ownerStats([home]);
  assert(stats.todayBookings >= 2 && stats.occupancy.current >= 1, "stats reflect new activity");

  await upsertReview(member, home._id, { rating: 5, title: "Great floor", comment: "Clean, friendly and not too busy.", categories: { cleanliness: 5, equipment: 4, staff: 5, value: 4 } });

  const ownerFeed = await listNotifications(owner._id, 50, "US");
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
  const memberFeed = await listNotifications(member._id, 50, "US");
  assert(memberFeed.some((n) => n.type === "pass.expiring" && n.title.includes("starts tomorrow")), "member reminded");
  const before = memberFeed.filter((n) => n.type === "pass.expiring").length;
  await sendPassReminders(evening);
  assert.equal((await listNotifications(member._id, 50, "US")).filter((n) => n.type === "pass.expiring").length, before, "reminder not repeated");

  const stale = await createBooking({ user: member, gymId: home._id, passType: "day", startDate: today, paymentMethod: "online" });
  await releaseAbandonedCheckouts(new Date(Date.now() + 3 * 60 * 60 * 1000));
  const staleDoc = await bookings.findOne({ _id: new (await import("mongodb")).ObjectId(stale.bookingId) });
  assert.equal(staleDoc?.status, "cancelled", "abandoned checkout released");
  // Paid after release: no pass was issued, so the money goes back exactly once
  let refunds = 0;
  const counting = { ...mockProvider, refund: async () => void refunds++ };
  assert.equal(await confirmOnlinePayment(staleDoc!._id, "late_session"), false, "released booking isn't revived");
  await refundOrphanedPayment(counting, staleDoc!._id, "late_session");
  await refundOrphanedPayment(counting, staleDoc!._id, "late_session");
  assert.equal(refunds, 1, "late payment refunded once");
  assert.equal((await bookings.findOne({ _id: staleDoc!._id }))?.paymentStatus, "refunded", "booking shows the refund");

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

  // Social: share a workout, owner follows, likes and comments; followers-only hides from strangers
  await ensureHandle(member);
  const memberFresh = (await (await collections.users()).findOne({ _id: member._id }))!;
  await updateSocialProfile(member._id, { handle: memberFresh.handle!, bio: "Smoke test", visibility: "public", shareCheckins: false });
  const postId = await shareWorkout(memberFresh, workoutId, "Felt strong");
  assert.equal((await shareWorkout(memberFresh, workoutId, "again")).toHexString(), postId.toHexString(), "sharing twice reuses the post");
  await follow(owner, member._id);
  const ownerFeed2 = await feed(owner._id, "following");
  assert(ownerFeed2.some((p) => p.id === postId.toHexString()), "follower sees the post");
  const liked = await toggleLike(owner, postId);
  assert.equal(liked.liked, true, "like recorded");
  await addComment(owner, postId, "Nice work");
  await reportPost(owner._id, postId, "spam");
  await reportPost(owner._id, postId, "still spam");
  assert.equal(await (await collections.reports()).countDocuments({ postId, reporterId: owner._id }), 1, "one report per person");
  await assert.rejects(reportPost(member._id, postId, "mine"), /postNotFound/, "can't report your own post");
  await (await collections.reports()).deleteMany({ postId });
  const memberNotes = await listNotifications(member._id, 50, "US");
  assert(memberNotes.some((n) => n.type === "social.follow") && memberNotes.some((n) => n.type === "social.comment"), "member notified of follow and comment");
  const stranger = await (await collections.users()).findOne({ _id: { $nin: [member._id, owner._id] } });
  await updateSocialProfile(member._id, { handle: memberFresh.handle!, bio: "", visibility: "followers", shareCheckins: false });
  if (stranger) {
    const strangerView = await feed(stranger._id, "discover");
    assert(!strangerView.some((p) => p.id === postId.toHexString()), "followers-only post hidden from strangers");
  }
  assert((await feed(owner._id, "following")).some((p) => p.id === postId.toHexString()), "follower still sees followers-only post");
  await updateSocialProfile(member._id, { handle: memberFresh.handle!, bio: "", visibility: "public", shareCheckins: false });

  // Staff: an invite only works for the invited email, and staff manage the gym's desk afterwards
  const staffEmail = `staff-${Date.now()}@fitplanet.dev`;
  const staffUser = await registerWithPassword({ name: "Desk Staff", email: staffEmail, password: "fitplanet123" });
  await inviteStaff(owner, home, staffEmail);
  const invites = await collections.staffInvites();
  const invite = await invites.findOne({ gymId: home._id, email: staffEmail });
  assert(invite, "invite stored");
  const token = "smoke-" + randomBytes(24).toString("base64url");
  await invites.updateOne({ _id: invite._id }, { $set: { tokenHash: createHash("sha256").update(token).digest("hex") } });
  await assert.rejects(acceptInvite(member, token), /inviteOtherEmail/, "invite refuses another account");
  await acceptInvite(staffUser, token);
  assert((await gymsManagedBy(staffUser._id)).some((g) => g._id.equals(home._id)), "staff manages the gym");
  assert.equal(await invites.countDocuments({ _id: invite._id }), 0, "invite used up");
  assert.equal(await deletionBlocker(staffUser._id), null, "staff can delete their account");
  assert.equal(await deletionBlocker(owner._id), "runsGym", "owners can't delete while running a gym");

  // Admin: suspending ends access, keeps the reason and is logged
  await setUserSuspended(owner, staffUser._id, { reason: "other", details: "smoke test" });
  const suspended = await users.findOne({ _id: staffUser._id });
  assert(suspended?.suspendedAt && suspended.suspension?.details === "smoke test", "suspended with reason");
  assert(await (await collections.adminLog()).findOne({ targetId: staffUser._id, action: "user.suspend", note: "smoke test" }), "suspension logged");
  await assert.rejects(setUserSuspended(owner, owner._id, { reason: "spam" }), /cannotSuspendSelf/, "admins can't suspend themselves");
  await setUserSuspended(owner, staffUser._id, null);
  assert(!(await users.findOne({ _id: staffUser._id }))?.suspension, "reason cleared on restore");

  // Admin: sample studios can be hidden, suspended with a reason and deleted; real ones with sales can't be deleted
  const gymsCol = await collections.gyms();
  const sample = await gymsCol.findOne({ isDemo: true, status: "published" });
  assert(sample, "seed marks sample studios");
  await moderateGym(owner, sample._id, "hide");
  assert.equal((await gymsCol.findOne({ _id: sample._id }))?.status, "draft", "hidden from the site");
  await moderateGym(owner, sample._id, "publish");
  await suspendGym(owner, sample._id, { reason: "misleading", details: "Photos are from another gym" });
  assert.equal((await gymsCol.findOne({ _id: sample._id }))?.suspension?.reason, "misleading", "gym suspension reason stored");
  await moderateGym(owner, sample._id, "restore");
  const restoredGym = await gymsCol.findOne({ _id: sample._id });
  assert(restoredGym?.status === "draft" && !restoredGym.suspension, "gym restored as draft without reason");
  await moderateGym(owner, sample._id, "publish");
  await assert.rejects(deleteGym(owner, home._id), /gymHasBookings/, "gyms with sales can't be deleted");
  const temp = { ...sample, _id: new ObjectId(), slug: `${sample.slug}-smoke-${Date.now()}` };
  await gymsCol.insertOne(temp);
  await deleteGym(owner, temp._id);
  assert.equal(await gymsCol.countDocuments({ _id: temp._id }), 0, "sample studio deleted");

  // Admin: account and studio views, admin access, listing edits and ownership moves
  const memberView = await adminUserDetail(member._id);
  assert(memberView && memberView.bookings.length > 0 && !("passwordHash" in memberView.user), "account view without password hash");
  await setUserAdmin(owner, staffUser._id, true);
  assert((await users.findOne({ _id: staffUser._id }))?.roles?.includes("admin"), "admin granted");
  await setUserAdmin(owner, staffUser._id, false);
  const revoked = await users.findOne({ _id: staffUser._id });
  assert(!revoked?.roles?.includes("admin") && revoked?.sessionsValidFrom, "admin removed and signed out");
  await assert.rejects(setUserAdmin(owner, owner._id, false), /cannotChangeOwnAccess/, "admins can't remove their own access");

  const gymView = await adminGymDetail(home._id);
  assert(gymView?.owner?._id.equals(owner._id) && gymView.staff.some((s) => s._id.equals(staffUser._id)), "studio view lists owner and staff");
  const edit = { ...home.address, name: home.name, description: home.description, capacity: home.capacity.max, ...home.pricing, phone: "+1 555 0100" };
  assert.equal(await adminUpdateGym(owner, home._id, edit, "smoke"), home.slug, "edit keeps the slug");
  assert.equal((await (await collections.gyms()).findOne({ _id: home._id }))?.contact?.phone, "+1 555 0100", "edit saved");

  await transferGym(owner, home._id, staffEmail);
  const moved = await (await collections.gyms()).findOne({ _id: home._id });
  assert(moved?.ownerId.equals(staffUser._id) && moved.staffIds?.some((id) => id.equals(owner._id)), "new owner, old owner kept as staff");
  await transferGym(owner, home._id, "owner@fitplanet.dev");
  assert((await (await collections.gyms()).findOne({ _id: home._id }))?.ownerId.equals(owner._id), "moved back");
  await assert.rejects(transferGym(owner, home._id, "nobody@fitplanet.dev"), /accountNotFound/, "transfer needs an account");

  assert((await adminBookings("all", deskDoc!.code)).some((r) => r.booking._id.equals(deskDoc!._id)), "booking search by code");
  await adminCancelBooking(owner, aheadDoc!._id, "smoke");
  assert.equal((await bookings.findOne({ _id: aheadDoc!._id }))?.status, "cancelled", "admin cancelled a desk pass");
  await assert.rejects(adminCancelBooking(owner, aheadDoc!._id), /onlyConfirmedCancel/, "cancel happens once");
  assert.equal((await adminGrowth()).series.length, 30, "growth covers 30 days");

  // Privacy: export leaves out secrets; deletion erases the account and its social traces
  const exported = await exportAccount(member._id);
  assert(!JSON.stringify(exported).includes("passwordHash"), "export has no password hash");
  assert(exported.workouts.length > 0 && exported.social.posts.length > 0, "export includes training and posts");
  await addComment(staffUser, postId, "See you at the desk");
  await follow(staffUser, member._id);
  await deleteAccount(staffUser._id);
  assert.equal(await users.countDocuments({ _id: staffUser._id }), 0, "account erased");
  assert.equal(await (await collections.comments()).countDocuments({ userId: staffUser._id }), 0, "comments erased");
  assert.equal(await (await collections.follows()).countDocuments({ followerId: staffUser._id }), 0, "follows erased");
  assert(!(await (await collections.gyms()).findOne({ _id: home._id }))?.staffIds?.some((id) => id.equals(staffUser._id)), "removed from gym staff");
  await assert.rejects(deleteAccount(member._id), /deleteActivePass/, "active pass blocks deletion");

  console.log("✓ smoke test passed", { todayBookings: stats.todayBookings, occupancy: stats.occupancy, ownerNotifications: ownerFeed.length });
  await (await getMongoClient()).close();
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
