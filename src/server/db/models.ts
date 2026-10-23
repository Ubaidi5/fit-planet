import type { ObjectId } from "mongodb";
import type { AddOn, Equipment, GymClass, OperatingHours, Trainer } from "@/lib/data/mock-gym-details";

/** Document shapes stored in MongoDB. UI-facing types live in `src/lib/types`. */

export type UserRole = "member" | "owner" | "admin";

export interface UserDoc {
  _id: ObjectId;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  /** bcrypt hash, only for email + password accounts */
  passwordHash?: string;
  roles?: UserRole[];
  phone?: string;
  homeCity?: string;
  regionCode?: string;
  savedGymIds?: ObjectId[];
  notificationPrefs?: NotificationPrefs;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationPrefs {
  push: boolean;
  email: boolean;
  bookingUpdates: boolean;
  passReminders: boolean;
  promotions: boolean;
}

export type GymStatus = "draft" | "published" | "suspended";

export interface GymDoc {
  _id: ObjectId;
  ownerId: ObjectId;
  /** Other users allowed to run the front desk */
  staffIds?: ObjectId[];
  status: GymStatus;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  coverImage: string;
  images: string[];
  address: { street: string; city: string; area: string };
  country: string;
  currency: string;
  timezone: string;
  /** GeoJSON point, [lng, lat], for $near queries */
  location: { type: "Point"; coordinates: [number, number] };
  pricing: { dayPass: number; weekPass: number; monthPass: number; annualPass?: number };
  amenities: string[];
  equipmentTypes: string[];
  hours: { open: string; close: string; is24Hours: boolean };
  operatingHours?: OperatingHours[];
  capacity: { max: number; dailyDayPassLimit?: number };
  equipment?: Equipment[];
  trainers?: Trainer[];
  classes?: GymClass[];
  addOns?: AddOn[];
  policies?: { cancellation: string; guestPolicy: string; dresscode: string; ageRestriction: string };
  contact?: { phone?: string; email?: string; website?: string; instagram?: string; facebook?: string };
  rating: number;
  totalReviews: number;
  ratingBreakdown?: { cleanliness: number; equipment: number; staff: number; value: number };
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PassType = "day" | "week" | "month";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded" | "expired";
export type PaymentMethod = "online" | "desk";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface BookingDoc {
  _id: ObjectId;
  /** Human friendly pass code shown on the pass and encoded in the QR */
  code: string;
  userId: ObjectId;
  gymId: ObjectId;
  ownerId: ObjectId;
  passType: PassType;
  /** Local date in the gym's timezone, YYYY-MM-DD */
  startDate: string;
  /** Inclusive last day of validity, YYYY-MM-DD */
  endDate: string;
  amount: number;
  currency: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProvider?: string;
  /** Checkout session / intent id at the provider */
  paymentRef?: string;
  guest: { name: string; email?: string | null; phone?: string | null };
  checkinCount: number;
  lastCheckinAt?: Date;
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  /** Reminders already sent for this booking, so the hourly job never repeats one */
  remindersSent?: ("start" | "end")[];
}

export interface CheckinDoc {
  _id: ObjectId;
  bookingId: ObjectId;
  gymId: ObjectId;
  userId: ObjectId;
  /** Staff member who scanned the pass */
  byUserId: ObjectId;
  method: "qr" | "code" | "manual";
  at: Date;
}

export interface ReviewDoc {
  _id: ObjectId;
  gymId: ObjectId;
  userId?: ObjectId | null;
  authorName: string;
  authorImage?: string | null;
  rating: number;
  title: string;
  comment: string;
  categories: { cleanliness: number; equipment: number; staff: number; value: number };
  isVerified: boolean;
  helpful: number;
  reply?: { text: string; at: Date };
  createdAt: Date;
}

export type NotificationType =
  | "booking.new"
  | "booking.confirmed"
  | "booking.cancelled"
  | "checkin"
  | "review.new"
  | "review.reply"
  | "pass.expiring"
  | "system";

export interface NotificationDoc {
  _id: ObjectId;
  userId: ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export interface PushTokenDoc {
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  userAgent?: string;
  createdAt: Date;
  lastSeenAt: Date;
}

export interface MediaDoc {
  _id: ObjectId;
  ownerId: ObjectId;
  key: string;
  url: string;
  contentType: string;
  size: number;
  provider: string;
  createdAt: Date;
}
