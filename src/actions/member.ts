"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { findRegion, REGION_COOKIE } from "@/lib/i18n/regions";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { collections, toObjectId } from "@/server/db/collections";
import { ownedUploads } from "@/server/modules/media";
import { endOtherSessions, getSessionUser } from "@/server/session";
import { updateSession } from "@/lib/auth";
import { setPassword, toggleSavedGym, UserError } from "@/server/modules/users";
import { ReviewError, upsertReview } from "@/server/modules/reviews";
import { done, fail, invalid } from "./utils";
import { allow } from "@/server/rate-limit";

export async function toggleSavedGymAction(gymId: string): Promise<ActionResult<{ saved: boolean }>> {
  const user = await getSessionUser();
  const id = toObjectId(gymId);
  if (!user) return fail("signInToSave");
  if (!id) return fail("gymNotFound");
  const saved = await toggleSavedGym(user._id, id);
  revalidatePath("/app/saved-gyms");
  return { ok: true, data: { saved } };
}

const profileSchema = z.object({
  name: z.string().trim().min(2, "name").max(80),
  phone: z.string().trim().max(24).optional(),
  homeCity: z.string().trim().max(60).optional(),
  regionCode: z.string().trim().max(10).optional(),
  image: z.string().trim().max(500).optional(),
});

export async function updateProfileAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const users = await collections.users();
  const { image: requested, ...rest } = parsed.data;
  // Only the current picture, an own upload, or none
  const image =
    requested === undefined || requested === "" || requested === user.image || (await ownedUploads(user._id, [requested])).has(requested)
      ? requested
      : undefined;
  await users.updateOne(
    { _id: user._id },
    { $set: { ...rest, ...(image !== undefined ? { image: image || null } : {}), updatedAt: new Date() } },
  );
  // The profile's region also drives the interface language on this device
  if (rest.regionCode && findRegion(rest.regionCode)) {
    (await cookies()).set(REGION_COOKIE, rest.regionCode, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  await updateSession({ user: { name: parsed.data.name, ...(image !== undefined ? { image: image || null } : {}) } });
  revalidatePath("/app", "layout");
  return done("profileSaved");
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
  if (!user) return fail("signInAgain");
  const parsed = prefsSchema.safeParse(prefs);
  if (!parsed.success) return fail("badRequest");
  const users = await collections.users();
  await users.updateOne({ _id: user._id }, { $set: { notificationPrefs: parsed.data, updatedAt: new Date() } });
  return done("saved");
}

const passwordSchema = z
  .object({
    current: z.string().optional(),
    password: z.string().min(8, "passwordLength").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "passwordsMatch", path: ["confirm"] });

export async function changePasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  // Stops someone at an unlocked laptop guessing the current password
  if (!(await allow("password-change", user._id.toHexString(), 10, 3600))) return fail("tooManyAttempts");
  try {
    await setPassword(user._id, parsed.data.password, parsed.data.current);
  } catch (error) {
    if (error instanceof UserError) {
      const failed = await fail(error.key, error.values);
      return { ...failed, fieldErrors: { current: failed.error } };
    }
    throw error;
  }
  await endOtherSessions(user._id);
  return done(user.passwordHash ? "passwordChanged" : "passwordAdded");
}

/** Signs out every other browser and phone; this one stays signed in */
export async function signOutOtherDevicesAction() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/app/security");
  await endOtherSessions(user._id);
  redirect("/app/security?devices=signed-out");
}

const score = z.coerce.number().int().min(1).max(5);
const reviewSchema = z.object({
  gymId: z.string(),
  rating: score,
  title: z.string().trim().min(3, "headline").max(80),
  comment: z.string().trim().min(10, "comment").max(1500),
  cleanliness: score,
  equipment: score,
  staff: score,
  value: score,
});

export async function submitReviewAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInToReview");
  if (!(await allow("review", user._id.toHexString(), 10, 3600))) return fail("tooManyAttempts");
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const gymId = toObjectId(parsed.data.gymId);
  if (!gymId) return fail("gymNotFound");
  const { rating, title, comment, cleanliness, equipment, staff, value } = parsed.data;
  try {
    await upsertReview(user, gymId, { rating, title, comment, categories: { cleanliness, equipment, staff, value } });
  } catch (error) {
    if (error instanceof ReviewError) return fail(error.key, error.values);
    throw error;
  }
  revalidatePath("/gyms/[id]", "page");
  return done("reviewLive");
}
