"use server";

import { revalidatePath } from "next/cache";
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
import { deleteUpload } from "@/server/modules/media";
import { notify } from "@/server/modules/notifications";
import { fieldErrors } from "./utils";

const time = z.string().regex(/^([01]\d|2[0-4]):[0-5]\d$/, "Use HH:MM");
const money = z.coerce.number().min(0).max(10_000_000);

const hoursSchema = z.array(
  z.object({ day: z.string(), open: time, close: time, isClosed: z.boolean() }),
);

const gymSchema = z.object({
  name: z.string().trim().min(2, "Add your gym's name").max(80),
  description: z.string().trim().min(20, "Write at least a sentence or two").max(300),
  longDescription: z.string().trim().max(4000).optional(),
  street: z.string().trim().min(2, "Add the street address").max(120),
  area: z.string().trim().min(2, "Add the neighbourhood").max(80),
  city: z.string().trim().min(2, "Add the city").max(60),
  country: z.string().trim().length(2, "Pick a country").toUpperCase(),
  currency: z.string().trim().length(3, "Pick a currency").toUpperCase(),
  timezone: z.string().trim().min(3).max(60),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  dayPass: money.refine((v) => v > 0, "Set a day pass price"),
  weekPass: money,
  monthPass: money,
  capacity: z.coerce.number().int().min(1, "At least 1").max(5000),
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
  website: z.union([z.url(), z.literal("")]).optional(),
  instagram: z.string().trim().max(60).optional(),
  facebook: z.string().trim().max(80).optional(),
  cancellation: z.string().trim().max(400).optional(),
  guestPolicy: z.string().trim().max(400).optional(),
  dresscode: z.string().trim().max(400).optional(),
  ageRestriction: z.string().trim().max(400).optional(),
});

export type GymInput = z.input<typeof gymSchema>;

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

async function ownerOrError(): Promise<{ user: UserDoc; gyms: GymDoc[] } | null> {
  const { user, gyms } = await getOwnerContext();
  return user ? { user, gyms } : null;
}

/** Onboarding: creates the owner's first (or another) gym as a draft */
export async function createGymAction(input: GymInput): Promise<ActionResult<{ id: string; slug: string }>> {
  const ctx = await ownerOrError();
  if (!ctx) return { ok: false, error: "Please sign in again." };
  const parsed = gymSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Some details need another look.", fieldErrors: fieldErrors(parsed.error) };

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
    title: "Your studio is ready",
    body: `${doc.name} is saved as a draft. Publish it from Gym profile when you're happy with it.`,
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
  if (!ctx || !gym) return { ok: false, error: "Only the owner can edit this gym." };
  const parsed = gymSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Some details need another look.", fieldErrors: fieldErrors(parsed.error) };

  const fields = gymFields(parsed.data);
  const slug = parsed.data.name !== gym.name || parsed.data.city !== gym.address.city ? await uniqueSlug(parsed.data.name, parsed.data.city, gym._id) : gym.slug;
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $set: { ...fields, slug, updatedAt: new Date() } });

  // Clean up photos that were removed from the gallery
  const removed = gym.images.filter((url) => !fields.images.includes(url));
  await Promise.all(removed.map((url) => deleteUpload(ctx.user._id, url)));

  revalidatePath("/studio", "layout");
  revalidatePath(`/gyms/${slug}`);
  revalidatePath("/gyms");
  return { ok: true, message: "Changes saved." };
}

export async function setGymStatusAction(gymId: string, status: "draft" | "published"): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(gymId);
  const gym = ctx?.gyms.find((g) => id && g._id.equals(id) && g.ownerId.equals(ctx.user._id));
  if (!ctx || !gym) return { ok: false, error: "Only the owner can publish this gym." };
  if (gym.status === "suspended") return { ok: false, error: "This listing is suspended. Contact support." };
  if (status === "published" && gym.images.length === 0) {
    return { ok: false, error: "Add at least one photo before going live." };
  }
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $set: { status, updatedAt: new Date() } });
  revalidatePath("/studio", "layout");
  revalidatePath("/gyms");
  revalidatePath(`/gyms/${gym.slug}`);
  return { ok: true, message: status === "published" ? "You're live. Members can book you now." : "Listing hidden from search." };
}

export async function checkInAction(code: string, method: "qr" | "code" = "code"): Promise<CheckinOutcome> {
  const ctx = await ownerOrError();
  if (!ctx || ctx.gyms.length === 0) return { ok: false, reason: "Sign in to your studio first." };
  if (!code.trim()) return { ok: false, reason: "Enter a pass code." };
  const result = await checkInByCode({ code, gymIds: ctx.gyms.map((g) => g._id), staffUserId: ctx.user._id, method });
  if (result.ok) revalidatePath("/studio/dashboard");
  return result;
}

export async function markDeskPaidAction(bookingId: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(bookingId);
  if (!ctx || !id) return { ok: false, error: "Booking not found." };
  try {
    await markDeskPaid(ctx.gyms.map((g) => g._id), id);
  } catch (error) {
    if (error instanceof BookingError) return { ok: false, error: error.message };
    throw error;
  }
  revalidatePath("/studio/bookings");
  return { ok: true, message: "Marked as paid." };
}

export async function ownerCancelBookingAction(bookingId: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(bookingId);
  if (!ctx || !id) return { ok: false, error: "Booking not found." };
  try {
    await cancelBookingByOwner(ctx.gyms.map((g) => g._id), id);
  } catch (error) {
    if (error instanceof BookingError) return { ok: false, error: error.message };
    console.error("[studio] cancel failed", error);
    return { ok: false, error: "Couldn't cancel this booking." };
  }
  revalidatePath("/studio/bookings");
  return { ok: true, message: "Booking cancelled and the member was told." };
}

export async function replyReviewAction(reviewId: string, text: string): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(reviewId);
  if (!ctx || !id) return { ok: false, error: "Review not found." };
  if (text.trim().length < 2 || text.length > 1000) return { ok: false, error: "Write a reply between 2 and 1000 characters." };
  try {
    await replyToReview(ctx.gyms.map((g) => g._id), id, text);
  } catch (error) {
    if (error instanceof ReviewError) return { ok: false, error: error.message };
    throw error;
  }
  revalidatePath("/studio/reviews");
  return { ok: true, message: "Reply posted." };
}

const csvCell = (value: unknown) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Bookings as CSV for spreadsheets */
export async function exportBookingsCsvAction(): Promise<ActionResult<{ csv: string; filename: string }>> {
  const ctx = await ownerOrError();
  if (!ctx || ctx.gyms.length === 0) return { ok: false, error: "Please sign in again." };
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
  dayPass: money.refine((v) => v > 0, "Set a day pass price"),
  weekPass: money,
  monthPass: money,
  dailyDayPassLimit: z.coerce.number().int().min(0).max(5000).optional(),
});

/** Quick pricing edit from the Passes page */
export async function updatePricingAction(gymId: string, input: z.input<typeof pricingSchema>): Promise<ActionResult> {
  const ctx = await ownerOrError();
  const id = toObjectId(gymId);
  const gym = ctx?.gyms.find((g) => id && g._id.equals(id) && g.ownerId.equals(ctx.user._id));
  if (!ctx || !gym) return { ok: false, error: "Only the owner can change prices." };
  const parsed = pricingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the prices.", fieldErrors: fieldErrors(parsed.error) };
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
  return { ok: true, message: "Prices updated. New bookings use them right away." };
}
