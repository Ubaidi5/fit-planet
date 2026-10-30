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
  /** Public @handle for the social side, unique, lowercase */
  handle?: string;
  bio?: string;
  social?: SocialPrefs;
  /** Set at password sign-up until the email is proven (reset link, email link or Google) */
  passwordUnverified?: boolean;
  /** Sessions signed in before this moment are no longer accepted */
  sessionsValidFrom?: Date;
  /** Set by an admin; a suspended account can't sign in */
  suspendedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialPrefs {
  /** "public": anyone signed in sees posts; "followers": only people you approve by following back */
  visibility: "public" | "followers";
  /** Post automatically when a gym checks you in */
  shareCheckins: boolean;
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
  /** Session refunded because it was paid after the booking had been released */
  lateRefundRef?: string;
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
  | "social.follow"
  | "social.like"
  | "social.comment"
  | "system";

export interface NotificationDoc {
  _id: ObjectId;
  userId: ObjectId;
  type: NotificationType;
  /** Message key under "notify" in messages/*.json; rendered in the reader's language */
  key?: string;
  params?: NotificationParams;
  /** English snapshot, used for older records without a key */
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

/**
 * Values for a notification message. By convention "startDate"/"endDate" are
 * YYYY-MM-DD, "amount" goes with "currency", and an empty "name" reads as "Someone".
 */
export type NotificationParams = Record<string, string | number>;

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

export interface RoutineItemDoc {
  /** Id from the static exercise catalog (src/lib/data/exercises.ts) */
  exerciseId: string;
  sets: number;
  /** Target, free text: "8-10", "12", or seconds for timed exercises */
  reps: string;
  weight: number | null;
  restSec: number;
}

export interface RoutineDoc {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  category: string;
  notes?: string;
  items: RoutineItemDoc[];
  favorite: boolean;
  timesCompleted: number;
  lastCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutDoc {
  _id: ObjectId;
  userId: ObjectId;
  routineId: ObjectId | null;
  routineName: string;
  startedAt: Date;
  completedAt: Date;
  durationMin: number;
  exercises: { exerciseId: string; sets: { reps: number; weight: number | null; done: boolean }[] }[];
  /** Sum of reps x weight over completed sets */
  volumeKg: number;
  setsDone: number;
  createdAt: Date;
}

export interface FollowDoc {
  _id: ObjectId;
  followerId: ObjectId;
  followeeId: ObjectId;
  createdAt: Date;
}

export type PostKind = "text" | "workout" | "checkin" | "routine";

export interface PostDoc {
  _id: ObjectId;
  userId: ObjectId;
  kind: PostKind;
  text?: string;
  imageUrl?: string;
  /** Snapshot of what the post is about, so the feed renders without joins */
  workout?: { id: ObjectId; routineName: string; durationMin: number; setsDone: number; volumeKg: number; exerciseIds: string[] };
  checkin?: { gymId: ObjectId; gymName: string; gymSlug: string; city: string };
  routine?: { id: ObjectId; name: string; category: string; items: RoutineItemDoc[] };
  visibility: "public" | "followers";
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

export interface LikeDoc {
  _id: ObjectId;
  postId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
}

export interface CommentDoc {
  _id: ObjectId;
  postId: ObjectId;
  userId: ObjectId;
  text: string;
  createdAt: Date;
}

export interface ReportDoc {
  _id: ObjectId;
  postId: ObjectId;
  reporterId: ObjectId;
  reason: string;
  createdAt: Date;
}

export interface AdminLogDoc {
  _id: ObjectId;
  adminId: ObjectId;
  action: string;
  targetType: "gym" | "user" | "post" | "booking";
  targetId: ObjectId;
  note?: string;
  at: Date;
}

export interface StaffInviteDoc {
  _id: ObjectId;
  gymId: ObjectId;
  email: string;
  tokenHash: string;
  invitedBy: ObjectId;
  createdAt: Date;
  expiresAt: Date;
}
