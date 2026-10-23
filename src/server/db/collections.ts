import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "./client";
import type {
  AdminLogDoc,
  BookingDoc,
  CheckinDoc,
  CommentDoc,
  FollowDoc,
  LikeDoc,
  PostDoc,
  ReportDoc,
  GymDoc,
  MediaDoc,
  NotificationDoc,
  PushTokenDoc,
  ReviewDoc,
  RoutineDoc,
  UserDoc,
  WorkoutDoc,
} from "./models";

/** Typed collection accessors. Collection names match the NextAuth adapter defaults. */
export const collections = {
  users: async () => (await getDb()).collection<UserDoc>("users"),
  gyms: async () => (await getDb()).collection<GymDoc>("gyms"),
  bookings: async () => (await getDb()).collection<BookingDoc>("bookings"),
  checkins: async () => (await getDb()).collection<CheckinDoc>("checkins"),
  reviews: async () => (await getDb()).collection<ReviewDoc>("reviews"),
  notifications: async () => (await getDb()).collection<NotificationDoc>("notifications"),
  pushTokens: async () => (await getDb()).collection<PushTokenDoc>("push_tokens"),
  media: async () => (await getDb()).collection<MediaDoc>("media"),
  routines: async () => (await getDb()).collection<RoutineDoc>("routines"),
  workouts: async () => (await getDb()).collection<WorkoutDoc>("workouts"),
  follows: async () => (await getDb()).collection<FollowDoc>("follows"),
  posts: async () => (await getDb()).collection<PostDoc>("posts"),
  likes: async () => (await getDb()).collection<LikeDoc>("likes"),
  comments: async () => (await getDb()).collection<CommentDoc>("comments"),
  reports: async () => (await getDb()).collection<ReportDoc>("reports"),
  adminLog: async () => (await getDb()).collection<AdminLogDoc>("admin_log"),
};

/** Parses a string id, returning null instead of throwing on bad input */
export function toObjectId(id: string | null | undefined): ObjectId | null {
  if (!id || !ObjectId.isValid(id)) return null;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

let indexesReady: Promise<void> | null = null;

/** Creates indexes once per process. Safe to call on every request. */
export function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true }),
        db.collection("gyms").createIndex({ slug: 1 }, { unique: true }),
        db.collection("gyms").createIndex({ ownerId: 1 }),
        db.collection("gyms").createIndex({ status: 1, "address.city": 1 }),
        db.collection("gyms").createIndex({ location: "2dsphere" }),
        db.collection("bookings").createIndex({ code: 1 }, { unique: true }),
        db.collection("bookings").createIndex({ userId: 1, createdAt: -1 }),
        db.collection("bookings").createIndex({ gymId: 1, createdAt: -1 }),
        db.collection("bookings").createIndex({ paymentRef: 1 }, { sparse: true }),
        db.collection("bookings").createIndex({ status: 1, startDate: 1 }),
        db.collection("bookings").createIndex({ status: 1, endDate: 1 }),
        db.collection("checkins").createIndex({ gymId: 1, at: -1 }),
        db.collection("checkins").createIndex({ userId: 1, at: -1 }),
        db.collection("reviews").createIndex({ gymId: 1, createdAt: -1 }),
        db.collection("notifications").createIndex({ userId: 1, createdAt: -1 }),
        db.collection("push_tokens").createIndex({ token: 1 }, { unique: true }),
        db.collection("push_tokens").createIndex({ userId: 1 }),
        db.collection("routines").createIndex({ userId: 1, updatedAt: -1 }),
        db.collection("workouts").createIndex({ userId: 1, completedAt: -1 }),
        db.collection("users").createIndex({ handle: 1 }, { unique: true, sparse: true }),
        db.collection("follows").createIndex({ followerId: 1, followeeId: 1 }, { unique: true }),
        db.collection("follows").createIndex({ followeeId: 1, createdAt: -1 }),
        db.collection("posts").createIndex({ userId: 1, createdAt: -1 }),
        db.collection("posts").createIndex({ visibility: 1, createdAt: -1 }),
        db.collection("likes").createIndex({ postId: 1, userId: 1 }, { unique: true }),
        db.collection("comments").createIndex({ postId: 1, createdAt: 1 }),
        db.collection("reports").createIndex({ postId: 1 }),
        db.collection("admin_log").createIndex({ at: -1 }),
      ]);
    })().catch((error) => {
      indexesReady = null;
      console.error("[db] failed to create indexes", error);
    });
  }
  return indexesReady;
}
