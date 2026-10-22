"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { collections, toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { updateSession } from "@/lib/auth";
import { setPassword, toggleSavedGym, UserError } from "@/server/modules/users";
import { ReviewError, upsertReview } from "@/server/modules/reviews";
import { fieldErrors } from "./utils";

export async function toggleSavedGymAction(gymId: string): Promise<ActionResult<{ saved: boolean }>> {
  const user = await getSessionUser();
  const id = toObjectId(gymId);
  if (!user) return { ok: false, error: "Sign in to save gyms." };
  if (!id) return { ok: false, error: "Gym not found." };
  const saved = await toggleSavedGym(user._id, id);
  revalidatePath("/app/saved-gyms");
  return { ok: true, data: { saved } };
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  phone: z.string().trim().max(24).optional(),
  homeCity: z.string().trim().max(60).optional(),
  regionCode: z.string().trim().max(10).optional(),
  image: z.string().trim().max(500).optional(),
});

export async function updateProfileAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const users = await collections.users();
  const { image, ...rest } = parsed.data;
  await users.updateOne(
    { _id: user._id },
    { $set: { ...rest, ...(image !== undefined ? { image: image || null } : {}), updatedAt: new Date() } },
  );
  await updateSession({ user: { name: parsed.data.name, ...(image !== undefined ? { image: image || null } : {}) } });
  revalidatePath("/app", "layout");
  return { ok: true, message: "Profile saved." };
}

const prefsSchema = z.object({
  push: z.boolean(),
  email: z.boolean(),
  bookingUpdates: z.boolean(),
  passReminders: z.boolean(),
  promotions: z.boolean(),
});

export async function updateNotificationPrefsAction(prefs: z.infer<typeof prefsSchema>): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const parsed = prefsSchema.safeParse(prefs);
  if (!parsed.success) return { ok: false, error: "Invalid settings." };
  const users = await collections.users();
  await users.updateOne({ _id: user._id }, { $set: { notificationPrefs: parsed.data, updatedAt: new Date() } });
  return { ok: true, message: "Saved." };
}

const passwordSchema = z
  .object({
    current: z.string().optional(),
    password: z.string().min(8, "Use at least 8 characters").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export async function changePasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await setPassword(user._id, parsed.data.password, parsed.data.current);
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message, fieldErrors: { current: error.message } };
    throw error;
  }
  return { ok: true, message: user.passwordHash ? "Password changed." : "Password added. You can now sign in with it." };
}

const score = z.coerce.number().int().min(1).max(5);
const reviewSchema = z.object({
  gymId: z.string(),
  rating: score,
  title: z.string().trim().min(3, "Add a short headline").max(80),
  comment: z.string().trim().min(10, "Tell people a bit more").max(1500),
  cleanliness: score,
  equipment: score,
  staff: score,
  value: score,
});

export async function submitReviewAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sign in to leave a review." };
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const gymId = toObjectId(parsed.data.gymId);
  if (!gymId) return { ok: false, error: "Gym not found." };
  const { rating, title, comment, cleanliness, equipment, staff, value } = parsed.data;
  try {
    await upsertReview(user, gymId, { rating, title, comment, categories: { cleanliness, equipment, staff, value } });
  } catch (error) {
    if (error instanceof ReviewError) return { ok: false, error: error.message };
    throw error;
  }
  revalidatePath("/gyms/[id]", "page");
  return { ok: true, message: "Thanks! Your review is live." };
}
