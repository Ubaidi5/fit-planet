"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import type { ActionResult, BookingView } from "@/lib/types";
import { collections, toObjectId } from "@/server/db/collections";
import type { GymDoc, UserDoc } from "@/server/db/models";
import { getOwnerContext } from "@/server/session";
import { uniqueSlug } from "@/server/modules/gyms";
import { BookingError, cancelBookingByOwner, listGymBookings, markDeskPaid } from "@/server/modules/bookings";
import { checkInByCode, type CheckinOutcome } from "@/server/modules/checkins";
import { replyToReview, ReviewError } from "@/server/modules/reviews";
import { deleteUpload, ownedUploads } from "@/server/modules/media";
import { notify } from "@/server/modules/notifications";
import { done, fail, invalid } from "./utils";
import { getRegion } from "@/lib/i18n/server";
import { formatDate } from "@/lib/dates";
import { allow } from "@/server/rate-limit";

const time = z.string().regex(/^([01]\d|2[0-4]):[0-5]\d$/, "time");
const money = z.coerce.number().min(0).max(10_000_000);

const hoursSchema = z.array(
  z.object({ day: z.string(), open: time, close: time, isClosed: z.boolean() }),
);

const gymSchema = z.object({
  name: z.string().trim().min(2, "gymName").max(80),
  description: z.string().trim().min(20, "description").max(300),
  longDescription: z.string().trim().max(4000).optional(),
  street: z.string().trim().min(2, "street").max(120),
  area: z.string().trim().min(2, "area").max(80),
  city: z.string().trim().min(2, "city").max(60),
  country: z.string().trim().length(2, "country").toUpperCase(),
  currency: z.string().trim().length(3, "currency").toUpperCase(),
  timezone: z.string().trim().min(3).max(60).refine(isTimeZone, "timezone"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  dayPass: money.refine((v) => v > 0, "dayPass"),
  weekPass: money,
  monthPass: money,
  capacity: z.coerce.number().int().min(1, "atLeastOne").max(5000),
  dailyDayPassLimit: z.coerce.number().int().min(0).max(5000).optional(),
  is24Hours: z.boolean(),
  open: time,
  close: time,
  operatingHours: hoursSchema.optional(),
  amenities: z.array(z.string().trim().min(1).max(40)).max(40),
  equipmentTypes: z.array(z.string().trim().min(1).max(40)).max(40),
  images: z.array(z.string().max(500)).max(20),
  coverImage: z.string().max(500).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  website: z.union([z.url({ protocol: /^https?$/ }), z.literal("")]).optional(),
  // Handles only, never URLs: they are appended to the network's own domain
  instagram: z.string().trim().max(60).regex(/^@?[\w.]*$/, "handle").optional(),
  facebook: z.string().trim().max(80).regex(/^[\w.\-]*$/, "handle").optional(),
  cancellation: z.string().trim().max(400).optional(),
  guestPolicy: z.string().trim().max(400).optional(),
  dresscode: z.string().trim().max(400).optional(),
  ageRestriction: z.string().trim().max(400).optional(),
});

export type GymInput = z.input<typeof gymSchema>;

function isTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const FALLBACK_COVER = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";

function gymFields(data: z.output<typeof gymSchema>) {
  const images = data.images.filter(Boolean);
  return {
    name: data.name,
    description: data.description,
    longDescription: data.longDescription || undefined,
    address: { street: data.street, area: data.area, city: data.city },
    country: data.country,
    currency: data.currency,
    timezone: data.timezone,
    location: { type: "Point" as const, coordinates: [data.lng, data.lat] as [number, number] },
    pricing: { dayPass: data.dayPass, weekPass: data.weekPass, monthPass: data.monthPass },
    capacity: { max: data.capacity, dailyDayPassLimit: data.dailyDayPassLimit || undefined },
    hours: { open: data.open, close: data.close, is24Hours: data.is24Hours },
    operatingHours: data.operatingHours,
    amenities: data.amenities,
    equipmentTypes: data.equipmentTypes,
    images,
    coverImage: data.coverImage && images.includes(data.coverImage) ? data.coverImage : images[0] ?? FALLBACK_COVER,
    contact: {
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
      instagram: data.instagram || undefined,
      facebook: data.facebook || undefined,
    },
    policies: {
      cancellation: data.cancellation || "Passes can be cancelled for a full refund until the day before they start.",
      guestPolicy: data.guestPolicy || "Guests need their own pass.",
      dresscode: data.dresscode || "Athletic wear and clean indoor shoes.",
      ageRestriction: data.ageRestriction || "16 and over.",
    },
  };
}

/** Keeps only photos this owner uploaded, or ones the gym already had */
async function allowedImages(ownerId: ObjectId, data: z.output<typeof gymSchema>, existing: string[] = []) {
  const wanted = data.images.filter(Boolean);
  const owned = await ownedUploads(ownerId, wanted);
  data.images = wanted.filter((url) => owned.has(url) || existing.includes(url));
  return data;
}

async function ownerOrError(): Promise<{ user: UserDoc; gyms: GymDoc[] } | null> {
  const { user, gyms } = await getOwnerContext();
  return user ? { user, gyms } : null;
}

/** Onboarding: creates the owner's first (or another) gym as a draft */
export async function createGymAction(input: GymInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const ctx = await ownerOrError();
  if (!ctx) return fail("signInAgain");
  const parsed = gymSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  await allowedImages(ctx.user._id, parsed.data);
  const gyms = await collections.gyms();
  const now = new Date();
  const slug = await uniqueSlug(parsed.data.name, parsed.data.city);
  const doc: GymDoc = {
    _id: new ObjectId(),
    ownerId: ctx.user._id,
    status: "draft",
    slug,
    ...gymFields(parsed.data),
    rating: 0,
    totalReviews: 0,
    isVerified: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
  await gyms.insertOne(doc);
  await (await collections.users()).updateOne({ _id: ctx.user._id }, { $addToSet: { roles: "owner" } });
  await notify(ctx.user._id, {
    type: "system",
    key: "studioReady",
    params: { gym: doc.name },
    link: "/studio/profile",
    silent: true,
  });
  revalidatePath("/studio", "layout");
  return { ok: true, data: { id: doc._id.toHexString(), slug } };
}

export async function updateGymAction(gymId: string, input: GymInput): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(gymId);
  const gym = ctx?.gyms.find((g) => id && g._id.equals(id) && g.ownerId.equals(ctx.user._id));
  if (!ctx || !gym) return fail("ownerOnly");
  const parsed = gymSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const fields = gymFields(await allowedImages(ctx.user._id, parsed.data, gym.images));
  const slug = parsed.data.name !== gym.name || parsed.data.city !== gym.address.city ? await uniqueSlug(parsed.data.name, parsed.data.city, gym._id) : gym.slug;
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $set: { ...fields, slug, updatedAt: new Date() } });

  // Clean up photos that were removed from the gallery
  const removed = gym.images.filter((url) => !fields.images.includes(url));
  await Promise.all(removed.map((url) => deleteUpload(ctx.user._id, url)));

  revalidatePath("/studio", "layout");
  revalidatePath(`/gyms/${slug}`);
  revalidatePath("/gyms");
  return done("changesSaved");
}

export async function setGymStatusAction(gymId: string, status: "draft" | "published"): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(gymId);
  const gym = ctx?.gyms.find((g) => id && g._id.equals(id) && g.ownerId.equals(ctx.user._id));
  if (!ctx || !gym) return fail("ownerOnly");
  if (gym.status === "suspended") return fail("listingSuspended");
  if (status === "published" && gym.images.length === 0) {
    return fail("addPhotoFirst");
  }
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $set: { status, updatedAt: new Date() } });
  revalidatePath("/studio", "layout");
  revalidatePath("/gyms");
  revalidatePath(`/gyms/${gym.slug}`);
  return done(status === "published" ? "published" : "unpublished");
}

export async function checkInAction(code: string, method: "qr" | "code" = "code"): Promise<CheckinOutcome> {
  const ctx = await ownerOrError();
  const t = await getTranslations("feedback.errors");
  if (!ctx || ctx.gyms.length === 0) return { ok: false, reason: t("signInStudio") };
  if (typeof code !== "string" || !code.trim()) return { ok: false, reason: t("enterCode") };
  // Pass codes are long enough that guessing needs volume; cap it per owner
  if (!(await allow("checkin", ctx.user._id.toHexString(), 120, 600))) return { ok: false, reason: t("tooManyAttempts") };
  const result = await checkInByCode({ code, gymIds: ctx.gyms.map((g) => g._id), staffUserId: ctx.user._id, method });
  if (result.ok) {
    revalidatePath("/studio/dashboard");
    return result;
  }
  const region = await getRegion();
  const values = result.values?.date ? { date: formatDate(result.values.date, region.locale) } : undefined;
  return { ...result, reason: t(result.reason, values) };
}

export async function markDeskPaidAction(bookingId: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(bookingId);
  if (!ctx || !id) return fail("bookingNotFound");
  try {
    await markDeskPaid(ctx.gyms.map((g) => g._id), id);
  } catch (error) {
    if (error instanceof BookingError) return fail(error.key, error.values);
    throw error;
  }
  revalidatePath("/studio/bookings");
  return done("markedPaid");
}

export async function ownerCancelBookingAction(bookingId: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(bookingId);
  if (!ctx || !id) return fail("bookingNotFound");
  try {
    await cancelBookingByOwner(ctx.gyms.map((g) => g._id), id);
  } catch (error) {
    if (error instanceof BookingError) return fail(error.key, error.values);
    console.error("[studio] cancel failed", error);
    return fail("cancelFailed");
  }
  revalidatePath("/studio/bookings");
  return done("cancelledMemberTold");
}

export async function replyReviewAction(reviewId: string, text: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(reviewId);
  if (!ctx || !id) return fail("reviewNotFound");
  if (typeof text !== "string" || text.trim().length < 2 || text.length > 1000) return fail("replyLength");
  try {
    await replyToReview(ctx.gyms.map((g) => g._id), id, text);
  } catch (error) {
    if (error instanceof ReviewError) return fail(error.key, error.values);
    throw error;
  }
  revalidatePath("/studio/reviews");
  return done("replyPosted");
}

const csvCell = (value: unknown) => {
  let text = String(value ?? "");
  // A member-typed name like =HYPERLINK(...) would run as a formula in Excel or Sheets
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Bookings as CSV for spreadsheets */
export async function exportBookingsCsvAction(): Promise<ActionResult<{ csv: string; filename: string }>> {
  const ctx = await ownerOrError();
  if (!ctx || ctx.gyms.length === 0) return fail("signInAgain");
  const rows: BookingView[] = await listGymBookings({ gymIds: ctx.gyms.map((g) => g._id), status: "all", limit: 5000 });
  const header = ["Code", "Member", "Email", "Phone", "Gym", "Pass", "Start", "End", "Amount", "Currency", "Status", "Payment", "Paid", "Check-ins", "Booked at"];
  const lines = rows.map((b) =>
    [b.code, b.guest.name, b.guest.email, b.guest.phone, b.gym.name, b.passType, b.startDate, b.endDate, b.amount, b.currency, b.status, b.paymentMethod, b.paymentStatus, b.checkinCount, b.createdAt]
      .map(csvCell)
      .join(","),
  );
  return { ok: true, data: { csv: [header.join(","), ...lines].join("\n"), filename: `fit-planet-bookings-${new Date().toISOString().slice(0, 10)}.csv` } };
}

const pricingSchema = z.object({
  dayPass: money.refine((v) => v > 0, "dayPass"),
  weekPass: money,
  monthPass: money,
  dailyDayPassLimit: z.coerce.number().int().min(0).max(5000).optional(),
});

/** Quick pricing edit from the Passes page */
export async function updatePricingAction(gymId: string, input: z.input<typeof pricingSchema>): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(gymId);
  const gym = ctx?.gyms.find((g) => id && g._id.equals(id) && g.ownerId.equals(ctx.user._id));
  if (!ctx || !gym) return fail("ownerOnly");
  const parsed = pricingSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error, "checkPrices");
  const { dayPass, weekPass, monthPass, dailyDayPassLimit } = parsed.data;
  await (await collections.gyms()).updateOne(
    { _id: gym._id },
    {
      $set: {
        "pricing.dayPass": dayPass,
        "pricing.weekPass": weekPass,
        "pricing.monthPass": monthPass,
        "capacity.dailyDayPassLimit": dailyDayPassLimit || undefined,
        updatedAt: new Date(),
      },
    },
  );
  revalidatePath("/studio", "layout");
  revalidatePath(`/gyms/${gym.slug}`);
  return done("pricesUpdated");
}
