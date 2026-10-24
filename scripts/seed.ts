/**
 * Loads the demo gyms, two demo accounts and some activity into MongoDB.
 * Safe to run more than once: gyms are matched by slug, users by email.
 *
 *   bun run db:seed            # gyms + demo accounts + sample bookings
 *   bun run db:seed --no-activity
 */
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { mockGyms } from "@/lib/data/mock-gyms";
import { getGymDetails, generateDefaultDetails } from "@/lib/data/mock-gym-details";
import { addDays, todayIn } from "@/lib/dates";
import { getMongoClient } from "@/server/db/client";
import { collections, ensureIndexes } from "@/server/db/collections";
import type { BookingDoc, CheckinDoc, GymDoc, UserDoc } from "@/server/db/models";
import { generatePassCode } from "@/server/modules/bookings";
import { refreshRating } from "@/server/modules/gyms";
import { ensureHandle } from "@/server/modules/social";
import { routineTemplates } from "@/lib/data/exercises";

const PASSWORD = process.env.SEED_PASSWORD || "fitplanet123";
const withActivity = !process.argv.includes("--no-activity");

async function upsertUser(email: string, name: string, roles: UserDoc["roles"]) {
  const users = await collections.users();
  const now = new Date();
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  await users.updateOne(
    { email },
    {
      $set: { name, roles, passwordHash, updatedAt: now },
      $setOnInsert: { _id: new ObjectId(), email, emailVerified: now, image: null, savedGymIds: [], createdAt: now },
    },
    { upsert: true },
  );
  return (await users.findOne({ email }))!;
}

async function main() {
  await ensureIndexes();
  const owner = await upsertUser("owner@fitplanet.dev", "Kamran Owner", ["member", "owner"]);
  const member = await upsertUser("member@fitplanet.dev", "Muhammad Ali", ["member"]);
  const gyms = await collections.gyms();
  const reviews = await collections.reviews();

  const gymIds: ObjectId[] = [];
  for (const [index, gym] of mockGyms.entries()) {
    const details = getGymDetails(gym.id) ?? generateDefaultDetails(gym);
    const now = new Date();
    const doc: Omit<GymDoc, "_id"> = {
      // The demo owner runs the first gym; the rest belong to a placeholder owner id
      ownerId: index === 0 ? owner._id : new ObjectId("000000000000000000000001"),
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
      createdAt: now,
      updatedAt: now,
    };
    const { createdAt, ...updatable } = doc;
    await gyms.updateOne({ slug: gym.slug }, { $set: updatable, $setOnInsert: { _id: new ObjectId(), createdAt } }, { upsert: true });
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
  console.log(`✓ ${gymIds.length} gyms`);

  if (withActivity) {
    const bookings = await collections.bookings();
    const checkins = await collections.checkins();
    const home = (await gyms.findOne({ _id: gymIds[0] }))!;
    const existing = await bookings.countDocuments({ gymId: home._id });
    if (existing === 0) {
      const today = todayIn(home.timezone);
      const names = ["Ayesha Khan", "Bilal Ahmed", "Sara Malik", "Hamza Raza", "Zainab Ali", "Usman Tariq", "Fatima Noor", "Omar Siddiqui"];
      const docs: BookingDoc[] = [];
      for (let day = -28; day <= 3; day++) {
        const perDay = 1 + ((((day * 7 + 31) % 4) + 4) % 4);
        for (let i = 0; i < perDay; i++) {
          const passType = (["day", "day", "day", "week", "month"] as const)[(day + i + 40) % 5];
          const start = addDays(today, day);
          const span = passType === "day" ? 1 : passType === "week" ? 7 : 30;
          // Booked the day before, or a little while ago for passes that start later
          const dayBefore = new Date(`${addDays(start, -1)}T10:00:00Z`);
          const created = dayBefore.getTime() < Date.now() ? dayBefore : new Date(Date.now() - (day * 3 + i + 1) * 3_600_000);
          docs.push({
            _id: new ObjectId(),
            code: generatePassCode(),
            userId: i === 0 && day === 0 ? member._id : new ObjectId(),
            gymId: home._id,
            ownerId: home.ownerId,
            passType,
            startDate: start,
            endDate: addDays(start, span - 1),
            amount: home.pricing[passType === "day" ? "dayPass" : passType === "week" ? "weekPass" : "monthPass"],
            currency: home.currency,
            status: "confirmed",
            paymentMethod: i % 3 === 2 ? "desk" : "online",
            paymentStatus: i % 3 === 2 && day >= 0 ? "unpaid" : "paid",
            paymentProvider: "mock",
            guest: { name: i === 0 && day === 0 ? member.name ?? "Member" : names[(day + 28 + i) % names.length], email: null, phone: null },
            checkinCount: 0,
            createdAt: created,
            confirmedAt: created,
          });
        }
      }
      await bookings.insertMany(docs);

      const visits: CheckinDoc[] = [];
      for (const b of docs) {
        if (b.startDate > today || b.paymentMethod === "desk") continue;
        const at = new Date(`${b.startDate}T${String(8 + (b.code.charCodeAt(4) % 12)).padStart(2, "0")}:15:00Z`);
        if (at.getTime() > Date.now()) continue;
        visits.push({ _id: new ObjectId(), bookingId: b._id, gymId: b.gymId, userId: b.userId, byUserId: owner._id, method: "qr", at });
        await bookings.updateOne({ _id: b._id }, { $set: { checkinCount: 1, lastCheckinAt: at } });
      }
      // A few people in the gym right now
      for (let i = 0; i < 6 && i < docs.length; i++) {
        const b = docs[docs.length - 10 + i];
        if (!b || b.startDate > today) continue;
        visits.push({ _id: new ObjectId(), bookingId: b._id, gymId: b.gymId, userId: b.userId, byUserId: owner._id, method: "qr", at: new Date(Date.now() - i * 9 * 60_000) });
      }
      if (visits.length) await checkins.insertMany(visits);
      console.log(`✓ ${docs.length} bookings, ${visits.length} check-ins at ${home.name}`);
    } else {
      console.log(`• ${home.name} already has bookings, skipping activity`);
    }
  }

  if (withActivity) await seedSocial(member);

  console.log(`\nDemo accounts (password: ${PASSWORD})\n  owner@fitplanet.dev  -> /studio\n  member@fitplanet.dev -> /app`);
  await (await getMongoClient()).close();
}

/** A handful of members from the target markets, with posts and follows, so the feed isn't empty */
async function seedSocial(member: UserDoc) {
  const posts = await collections.posts();
  if (await posts.countDocuments({}, { limit: 1 })) {
    console.log("• social posts already exist, skipping");
    return;
  }
  const people = [
    { email: "lena@fitplanet.dev", name: "Lena Fischer", bio: "Berlin · deadlifts and long runs", city: "Berlin" },
    { email: "jack@fitplanet.dev", name: "Jack Turner", bio: "Sydney · surf mornings, gym evenings", city: "Sydney" },
    { email: "elif@fitplanet.dev", name: "Elif Yılmaz", bio: "İstanbul · yoga and kettlebells", city: "Istanbul" },
    { email: "omar@fitplanet.dev", name: "Omar Haddad", bio: "Dubai · hybrid training", city: "Dubai" },
    { email: "maya@fitplanet.dev", name: "Maya Brooks", bio: "New York · coach, mum, PR chaser", city: "New York" },
  ];
  const users = await collections.users();
  const gyms = await (await collections.gyms()).find({ status: "published" }).toArray();
  const follows = await collections.follows();
  const texts = [
    "New squat PR today. 140 for a clean triple. Months of patience paying off.",
    "Travel week. Found a great gym near the hotel with a day pass, no membership needed.",
    "Rest days are training days too. Long walk, good food, early night.",
    "Anyone else do their cardio first thing? Thinking of switching to evenings.",
    "Five weeks of the push/pull/legs split done. Shoulders finally feel stable.",
  ];
  let minutesAgo = 25;
  for (const [i, p] of people.entries()) {
    const user = await upsertUser(p.email, p.name, ["member"]);
    await users.updateOne({ _id: user._id }, { $set: { bio: p.bio } });
    await ensureHandle(user);
    const base = { userId: user._id, visibility: "public" as const, likeCount: (i * 7) % 12, commentCount: 0 };
    await posts.insertOne({ _id: new ObjectId(), ...base, kind: "text", text: texts[i], createdAt: new Date(Date.now() - minutesAgo * 60_000) });
    minutesAgo += 95;
    const gym = gyms.find((g) => g.address.city === p.city) ?? gyms[(i * 5) % Math.max(1, gyms.length)];
    if (gym) {
      await posts.insertOne({
        _id: new ObjectId(),
        ...base,
        kind: "checkin",
        checkin: { gymId: gym._id, gymName: gym.name, gymSlug: gym.slug, city: gym.address.city },
        createdAt: new Date(Date.now() - minutesAgo * 60_000),
      });
      minutesAgo += 140;
    }
    if (i % 2 === 0) {
      const t = routineTemplates[i % routineTemplates.length];
      await posts.insertOne({
        _id: new ObjectId(),
        ...base,
        kind: "routine",
        text: `My go-to ${t.name.toLowerCase()}. Steal it.`,
        routine: { id: new ObjectId(), name: t.name, category: t.category, items: t.items },
        createdAt: new Date(Date.now() - minutesAgo * 60_000),
      });
      minutesAgo += 200;
    }
    // The demo member follows the first three, and everyone follows the demo member back
    if (i < 3) await follows.updateOne({ followerId: member._id, followeeId: user._id }, { $setOnInsert: { _id: new ObjectId(), createdAt: new Date() } }, { upsert: true });
    await follows.updateOne({ followerId: user._id, followeeId: member._id }, { $setOnInsert: { _id: new ObjectId(), createdAt: new Date() } }, { upsert: true });
  }
  await ensureHandle(member);
  console.log(`✓ ${people.length} social members with posts`);
}

main().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
