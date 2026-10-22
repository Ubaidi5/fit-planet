import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { collections } from "@/server/db/collections";
import { getDb } from "@/server/db/client";
import type { NotificationPrefs, UserDoc } from "@/server/db/models";
import { env } from "@/server/env";
import { email } from "@/server/services/email";
import { passwordResetEmail } from "@/server/services/email/templates";

export class UserError extends Error {}

export const defaultNotificationPrefs: NotificationPrefs = {
  push: true,
  email: true,
  bookingUpdates: true,
  passReminders: true,
  promotions: false,
};

export async function registerWithPassword(input: { name: string; email: string; password: string; phone?: string }) {
  const users = await collections.users();
  const address = input.email.toLowerCase();
  const existing = await users.findOne({ email: address });
  const passwordHash = await bcrypt.hash(input.password, 12);

  if (existing) {
    // An OAuth or magic-link account can add a password once; otherwise it's taken
    if (existing.passwordHash) throw new UserError("An account with this email already exists. Try signing in.");
    throw new UserError("This email already signs in with Google or an email link. Use that, then add a password in Security.");
  }

  const now = new Date();
  const doc: UserDoc = {
    _id: new ObjectId(),
    name: input.name.trim(),
    email: address,
    emailVerified: null,
    image: null,
    passwordHash,
    phone: input.phone?.trim() || undefined,
    roles: ["member"],
    notificationPrefs: defaultNotificationPrefs,
    savedGymIds: [],
    createdAt: now,
    updatedAt: now,
  };
  await users.insertOne(doc);
  return doc;
}

export async function setPassword(userId: ObjectId, password: string, currentPassword?: string) {
  const users = await collections.users();
  const user = await users.findOne({ _id: userId });
  if (!user) throw new UserError("Account not found.");
  if (user.passwordHash) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new UserError("Your current password isn't right.");
    }
  }
  await users.updateOne({ _id: userId }, { $set: { passwordHash: await bcrypt.hash(password, 12), updatedAt: new Date() } });
}

interface ResetDoc {
  _id: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Sends a reset link. Always resolves, so it can't be used to probe for accounts. */
export async function requestPasswordReset(address: string, portal: "app" | "studio" = "app") {
  const users = await collections.users();
  const user = await users.findOne({ email: address.toLowerCase() });
  if (!user?.email) return;
  const token = randomBytes(32).toString("base64url");
  const resets = (await getDb()).collection<ResetDoc>("password_resets");
  await resets.deleteMany({ userId: user._id });
  await resets.insertOne({ _id: new ObjectId(), userId: user._id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 3_600_000) });
  const url = `${env.appUrl}/reset-password?token=${token}${portal === "studio" ? "&portal=studio" : ""}`;
  await email().send(passwordResetEmail(user.email, url));
}

export async function resetPassword(token: string, password: string) {
  const resets = (await getDb()).collection<ResetDoc>("password_resets");
  const reset = await resets.findOneAndDelete({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!reset) throw new UserError("This reset link has expired. Ask for a new one.");
  const users = await collections.users();
  await users.updateOne(
    { _id: reset.userId },
    { $set: { passwordHash: await bcrypt.hash(password, 12), emailVerified: new Date(), updatedAt: new Date() } },
  );
  const user = await users.findOne({ _id: reset.userId }, { projection: { email: 1 } });
  return user?.email ?? null;
}

export async function toggleSavedGym(userId: ObjectId, gymId: ObjectId) {
  const users = await collections.users();
  const user = await users.findOne({ _id: userId }, { projection: { savedGymIds: 1 } });
  const saved = user?.savedGymIds?.some((id) => id.equals(gymId)) ?? false;
  await users.updateOne({ _id: userId }, saved ? { $pull: { savedGymIds: gymId } } : { $addToSet: { savedGymIds: gymId } });
  return !saved;
}
