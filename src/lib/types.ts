// Client-safe shapes the server hands to React. Ids are strings and dates are
// ISO strings so everything crosses the server/client boundary cleanly.

import type { Gym } from "@/lib/data/mock-gyms";
import type { GymDetail, Review } from "@/lib/data/mock-gym-details";
import type { PassType } from "@/lib/passes";

export type { Gym, GymDetail, Review, PassType };

export type GymStatus = "draft" | "published" | "suspended";

/** A gym plus everything its public profile page needs */
export interface GymProfile {
  gym: Gym;
  details: GymDetail;
  status: GymStatus;
  ownerId: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded" | "expired";
export type PaymentMethod = "online" | "desk";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface BookingView {
  id: string;
  code: string;
  passType: PassType;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  checkinCount: number;
  lastCheckinAt: string | null;
  createdAt: string;
  guest: { name: string; email?: string | null; phone?: string | null };
  gym: {
    id: string;
    slug: string;
    name: string;
    city: string;
    area: string;
    country: string;
    timezone: string;
    coverImage: string;
  };
  /** Derived: confirmed and today is within the validity window */
  isActive: boolean;
  /** Derived: confirmed and starts in the future */
  isUpcoming: boolean;
}

export interface NotificationView {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface CheckinView {
  id: string;
  at: string;
  method: "qr" | "code" | "manual";
  memberName: string;
  passType: PassType;
  bookingCode: string;
  gym: { id: string; name: string; city: string; country: string; slug: string };
}

/** Standard return shape for server actions used by forms */
export type ActionResult<T = undefined> =
  | ({ ok: true; message?: string } & (T extends undefined ? { data?: undefined } : { data: T }))
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export interface RoutineItem {
  exerciseId: string;
  sets: number;
  reps: string;
  weight: number | null;
  restSec: number;
}

export interface RoutineView {
  id: string;
  name: string;
  category: string;
  notes: string;
  items: RoutineItem[];
  favorite: boolean;
  timesCompleted: number;
  lastCompletedAt: string | null;
}

export interface WorkoutSetLog {
  reps: number;
  weight: number | null;
  done: boolean;
}

export interface WorkoutView {
  id: string;
  routineId: string | null;
  routineName: string;
  startedAt: string;
  completedAt: string;
  durationMin: number;
  volumeKg: number;
  setsDone: number;
  exercises: { exerciseId: string; sets: WorkoutSetLog[] }[];
}
