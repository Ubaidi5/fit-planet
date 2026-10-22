import "server-only";
import { randomInt } from "node:crypto";
import { MongoServerError, ObjectId, type Filter } from "mongodb";
import { collections } from "@/server/db/collections";
import type { BookingDoc, GymDoc, UserDoc } from "@/server/db/models";
import type { BookingView } from "@/lib/types";
import { addDays, daysBetween, formatDate, isIsoDate, todayIn } from "@/lib/dates";
import { passMeta, type PassType } from "@/lib/passes";
import { env } from "@/server/env";
import { payments, paymentProvider } from "@/server/services/payments";
import { email } from "@/server/services/email";
import { bookingConfirmedEmail } from "@/server/services/email/templates";
import { notify } from "./notifications";

/** How far ahead a pass can be booked */
export const MAX_DAYS_AHEAD = 60;

export class BookingError extends Error {}

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Readable pass code like FP-7K3Q-M9XA. No 0/O/1/I to avoid misreads at the desk. */
export function generatePassCode() {
  const chunk = () => Array.from({ length: 4 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  return `FP-${chunk()}-${chunk()}`;
}

export function normalizePassCode(input: string) {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = clean.startsWith("FP") ? clean.slice(2) : clean;
  return body.length === 8 ? `FP-${body.slice(0, 4)}-${body.slice(4)}` : input.trim().toUpperCase();
}

export function formatMoney(amount: number, currency: string, locale = "en") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount);
}

type GymSummary = Pick<GymDoc, "_id" | "slug" | "name" | "address" | "country" | "timezone" | "coverImage">;

export function toBookingView(doc: BookingDoc, gym: GymSummary): BookingView {
  const today = todayIn(gym.timezone);
  const confirmed = doc.status === "confirmed";
  return {
    id: doc._id.toHexString(),
    code: doc.code,
    passType: doc.passType,
    startDate: doc.startDate,
    endDate: doc.endDate,
    amount: doc.amount,
    currency: doc.currency,
    status: confirmed && doc.endDate < today ? "expired" : doc.status,
    paymentMethod: doc.paymentMethod,
    paymentStatus: doc.paymentStatus,
    checkinCount: doc.checkinCount,
    lastCheckinAt: doc.lastCheckinAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    guest: doc.guest,
    gym: {
      id: gym._id.toHexString(),
      slug: gym.slug,
      name: gym.name,
      city: gym.address.city,
      area: gym.address.area,
      country: gym.country,
      timezone: gym.timezone,
      coverImage: gym.coverImage,
    },
    isActive: confirmed && doc.startDate <= today && doc.endDate >= today,
    isUpcoming: confirmed && doc.startDate > today,
  };
}

const gymProjection = { _id: 1, slug: 1, name: 1, address: 1, country: 1, timezone: 1, coverImage: 1 } as const;

/** Attaches gym summaries to a list of bookings */
export async function withGyms(docs: BookingDoc[]): Promise<BookingView[]> {
  if (docs.length === 0) return [];
  const gyms = await collections.gyms();
  const ids = [...new Set(docs.map((d) => d.gymId.toHexString()))].map((id) => new ObjectId(id));
  const gymDocs = await gyms.find({ _id: { $in: ids } }, { projection: gymProjection }).toArray();
  const byId = new Map(gymDocs.map((g) => [g._id.toHexString(), g as GymSummary]));
  return docs.flatMap((doc) => {
    const gym = byId.get(doc.gymId.toHexString());
    return gym ? [toBookingView(doc, gym)] : [];
  });
}

export interface CreateBookingInput {
  user: Pick<UserDoc, "_id" | "name" | "email" | "phone">;
  gymId: ObjectId;
  passType: PassType;
  startDate: string;
  paymentMethod: "online" | "desk";
  guestName?: string;
  guestPhone?: string;
}

export interface CreateBookingResult {
  bookingId: string;
  /** Present for online payments: where to send the member */
  checkoutUrl?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: input.gymId });
  if (!gym || gym.status !== "published") throw new BookingError("This gym isn't taking bookings right now.");

  const today = todayIn(gym.timezone);
  if (!isIsoDate(input.startDate)) throw new BookingError("Pick a valid start date.");
  const ahead = daysBetween(today, input.startDate);
  if (ahead < 0) throw new BookingError("The start date has already passed in the gym's timezone.");
  if (ahead > MAX_DAYS_AHEAD) throw new BookingError(`Passes can be booked up to ${MAX_DAYS_AHEAD} days ahead.`);

  if (input.paymentMethod === "desk" && !env.payments.allowPayAtDesk) {
    throw new BookingError("Paying at the desk isn't available.");
  }

  const meta = passMeta[input.passType];
  const amount = gym.pricing[meta.pricingKey];
  if (!amount || amount <= 0) throw new BookingError("This pass isn't on sale at this gym.");

  const bookings = await collections.bookings();

  // Respect the gym's daily day-pass limit, if it set one
  if (input.passType === "day" && gym.capacity.dailyDayPassLimit) {
    const sold = await bookings.countDocuments({
      gymId: gym._id,
      passType: "day",
      startDate: input.startDate,
      status: { $in: ["pending", "confirmed"] },
    });
    if (sold >= gym.capacity.dailyDayPassLimit) throw new BookingError("Day passes for that date are sold out. Try another day.");
  }

  const now = new Date();
  const base: Omit<BookingDoc, "_id" | "code"> = {
    userId: input.user._id,
    gymId: gym._id,
    ownerId: gym.ownerId,
    passType: input.passType,
    startDate: input.startDate,
    endDate: addDays(input.startDate, meta.days - 1),
    amount,
    currency: gym.currency,
    status: input.paymentMethod === "desk" ? "confirmed" : "pending",
    paymentMethod: input.paymentMethod,
    paymentStatus: "unpaid",
    guest: {
      name: input.guestName?.trim() || input.user.name || "Member",
      email: input.user.email,
      phone: input.guestPhone?.trim() || input.user.phone || null,
    },
    checkinCount: 0,
    createdAt: now,
    confirmedAt: input.paymentMethod === "desk" ? now : undefined,
  };

  let booking: BookingDoc | null = null;
  for (let attempt = 0; attempt < 5 && !booking; attempt++) {
    const candidate: BookingDoc = { ...base, _id: new ObjectId(), code: generatePassCode() };
    try {
      await bookings.insertOne(candidate);
      booking = candidate;
    } catch (error) {
      if (!(error instanceof MongoServerError && error.code === 11000)) throw error;
    }
  }
  if (!booking) throw new BookingError("Couldn't create the booking. Please try again.");

  if (input.paymentMethod === "desk") {
    await onBookingConfirmed(booking, gym);
    return { bookingId: booking._id.toHexString() };
  }

  const provider = payments();
  const id = booking._id.toHexString();
  const session = await provider.createCheckout({
    reference: id,
    currency: gym.currency,
    customerEmail: input.user.email,
    successUrl: `${env.appUrl}/checkout/success?booking=${id}&session={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${env.appUrl}/gyms/${gym.slug}/book?pass=${input.passType}&date=${input.startDate}&cancelled=1`,
    items: [
      {
        name: `${meta.label} · ${gym.name}`,
        description: `${formatDate(booking.startDate)}${meta.days > 1 ? ` to ${formatDate(booking.endDate)}` : ""} · ${gym.address.area}, ${gym.address.city}`,
        amount,
        quantity: 1,
        imageUrl: gym.coverImage,
      },
    ],
    metadata: { gymId: gym._id.toHexString(), passType: input.passType },
  });

  await bookings.updateOne({ _id: booking._id }, { $set: { paymentProvider: provider.name, paymentRef: session.id } });
  // Stripe substitutes {CHECKOUT_SESSION_ID}; other providers get the id filled in here
  return { bookingId: id, checkoutUrl: session.url.replace("{CHECKOUT_SESSION_ID}", session.id) };
}

/**
 * Marks an online booking paid. Idempotent: webhook, success page and mock
 * gateway can all call it and the side effects run exactly once.
 */
export async function confirmOnlinePayment(bookingId: ObjectId, providerRef?: string) {
  const bookings = await collections.bookings();
  const now = new Date();
  const updated = await bookings.findOneAndUpdate(
    { _id: bookingId, status: "pending" },
    {
      $set: {
        status: "confirmed",
        paymentStatus: "paid",
        confirmedAt: now,
        ...(providerRef ? { paymentRef: providerRef } : {}),
      },
    },
    { returnDocument: "after" },
  );
  if (!updated) return false;
  const gyms = await collections.gyms();
  const gym = await gyms.findOne({ _id: updated.gymId });
  if (gym) await onBookingConfirmed(updated, gym);
  return true;
}

export async function markPaymentFailed(bookingId: ObjectId) {
  const bookings = await collections.bookings();
  await bookings.updateOne({ _id: bookingId, status: "pending" }, { $set: { status: "cancelled", paymentStatus: "failed", cancelledAt: new Date() } });
}

/** Side effects of a new confirmed booking: owner alert, member alert, receipt email */
async function onBookingConfirmed(booking: BookingDoc, gym: GymDoc) {
  const meta = passMeta[booking.passType];
  const price = formatMoney(booking.amount, booking.currency);
  const dates =
    meta.days > 1 ? `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}` : formatDate(booking.startDate, "en", { weekday: "short", day: "numeric", month: "short" });
  const paidNote = booking.paymentMethod === "desk" ? "pays at the desk" : "paid online";

  await Promise.all([
    notify(booking.ownerId, {
      type: "booking.new",
      title: `New ${meta.label.toLowerCase()} at ${gym.name}`,
      body: `${booking.guest.name} booked for ${dates} · ${price}, ${paidNote}.`,
      link: `/studio/bookings?focus=${booking._id.toHexString()}`,
    }),
    notify(booking.userId, {
      type: "booking.confirmed",
      title: "You're booked in",
      body: `${meta.label} at ${gym.name} for ${dates}. Show your QR code at the desk.`,
      link: `/app/passes/${booking._id.toHexString()}`,
      silent: true,
    }),
  ]);

  if (booking.guest.email) {
    try {
      await email().send(
        bookingConfirmedEmail(booking.guest.email, {
          name: booking.guest.name,
          gymName: gym.name,
          passLabel: meta.label,
          dates,
          code: booking.code,
          amount: booking.paymentMethod === "desk" ? `${price} (pay at the desk)` : price,
          url: `${env.appUrl}/app/passes/${booking._id.toHexString()}`,
        }),
      );
    } catch (error) {
      console.error("[booking] receipt email failed", error);
    }
  }
}

export async function listUserBookings(userId: ObjectId) {
  const bookings = await collections.bookings();
  const docs = await bookings
    .find({ userId, status: { $in: ["confirmed", "cancelled", "refunded", "pending"] } })
    .sort({ startDate: -1, createdAt: -1 })
    .limit(200)
    .toArray();
  // Abandoned checkouts older than a day are noise
  const cutoff = Date.now() - 86_400_000;
  return withGyms(docs.filter((d) => d.status !== "pending" || d.createdAt.getTime() > cutoff));
}

export async function getUserBooking(userId: ObjectId, bookingId: ObjectId) {
  const bookings = await collections.bookings();
  const doc = await bookings.findOne({ _id: bookingId, userId });
  if (!doc) return null;
  const [view] = await withGyms([doc]);
  return view ?? null;
}

/** Member cancellation: free before the pass starts and before any check-in */
export async function cancelBookingByMember(userId: ObjectId, bookingId: ObjectId) {
  const bookings = await collections.bookings();
  const doc = await bookings.findOne({ _id: bookingId, userId });
  if (!doc) throw new BookingError("Booking not found.");
  const gym = await (await collections.gyms()).findOne({ _id: doc.gymId });
  if (!gym) throw new BookingError("Gym not found.");

  if (doc.status === "pending") {
    await bookings.updateOne({ _id: doc._id }, { $set: { status: "cancelled", cancelledAt: new Date() } });
    return;
  }
  if (doc.status !== "confirmed") throw new BookingError("This booking can't be cancelled.");
  if (doc.checkinCount > 0 || doc.startDate <= todayIn(gym.timezone)) {
    throw new BookingError("Passes can be cancelled until the day before they start.");
  }

  let refunded = false;
  if (doc.paymentStatus === "paid" && doc.paymentProvider && doc.paymentRef) {
    await paymentProvider(doc.paymentProvider)?.refund(doc.paymentRef);
    refunded = true;
  }
  await bookings.updateOne(
    { _id: doc._id },
    { $set: { status: refunded ? "refunded" : "cancelled", paymentStatus: refunded ? "refunded" : doc.paymentStatus, cancelledAt: new Date() } },
  );
  await notify(doc.ownerId, {
    type: "booking.cancelled",
    title: "Booking cancelled",
    body: `${doc.guest.name} cancelled a ${passMeta[doc.passType].label.toLowerCase()} for ${formatDate(doc.startDate)}.`,
    link: `/studio/bookings?focus=${doc._id.toHexString()}`,
  });
}

export interface OwnerBookingFilter {
  gymIds: ObjectId[];
  status?: "active" | "upcoming" | "past" | "cancelled" | "all";
  passType?: PassType;
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export async function listGymBookings(filter: OwnerBookingFilter) {
  const bookings = await collections.bookings();
  const query: Filter<BookingDoc> = { gymId: { $in: filter.gymIds }, status: { $ne: "pending" } };
  if (filter.passType) query.passType = filter.passType;
  if (filter.status === "cancelled") query.status = { $in: ["cancelled", "refunded"] };
  else if (filter.status && filter.status !== "all") query.status = "confirmed";
  if (filter.from) query.startDate = { ...(query.startDate as object), $gte: filter.from };
  if (filter.to) query.startDate = { ...(query.startDate as object), $lte: filter.to };
  if (filter.q) {
    const pattern = new RegExp(filter.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ "guest.name": pattern }, { "guest.email": pattern }, { "guest.phone": pattern }, { code: pattern }];
  }
  const docs = await bookings.find(query).sort({ createdAt: -1 }).limit(filter.limit ?? 500).toArray();
  const views = await withGyms(docs);
  if (filter.status === "active") return views.filter((v) => v.isActive);
  if (filter.status === "upcoming") return views.filter((v) => v.isUpcoming);
  if (filter.status === "past") return views.filter((v) => v.status === "expired");
  return views;
}

/** Owner marks a pay-at-desk booking as paid */
export async function markDeskPaid(gymIds: ObjectId[], bookingId: ObjectId) {
  const bookings = await collections.bookings();
  const result = await bookings.updateOne(
    { _id: bookingId, gymId: { $in: gymIds }, paymentMethod: "desk", status: "confirmed" },
    { $set: { paymentStatus: "paid" } },
  );
  if (result.matchedCount === 0) throw new BookingError("Booking not found.");
}

/** Owner cancels a booking, refunding online payments */
export async function cancelBookingByOwner(gymIds: ObjectId[], bookingId: ObjectId) {
  const bookings = await collections.bookings();
  const doc = await bookings.findOne({ _id: bookingId, gymId: { $in: gymIds } });
  if (!doc || doc.status !== "confirmed") throw new BookingError("Only confirmed bookings can be cancelled.");
  let refunded = false;
  if (doc.paymentStatus === "paid" && doc.paymentMethod === "online" && doc.paymentProvider && doc.paymentRef) {
    await paymentProvider(doc.paymentProvider)?.refund(doc.paymentRef);
    refunded = true;
  }
  await bookings.updateOne(
    { _id: doc._id },
    { $set: { status: refunded ? "refunded" : "cancelled", paymentStatus: refunded ? "refunded" : doc.paymentStatus, cancelledAt: new Date() } },
  );
  const gym = await (await collections.gyms()).findOne({ _id: doc.gymId }, { projection: { name: 1 } });
  await notify(doc.userId, {
    type: "booking.cancelled",
    title: "Your booking was cancelled",
    body: `${gym?.name ?? "The gym"} cancelled your ${passMeta[doc.passType].label.toLowerCase()} for ${formatDate(doc.startDate)}.${refunded ? " A full refund is on its way." : ""}`,
    link: `/app/passes/${doc._id.toHexString()}`,
  });
}
