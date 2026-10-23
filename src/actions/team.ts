"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getOwnerContext, getSessionUser, ownedGyms } from "@/server/session";
import { acceptInvite, cancelInvite, inviteStaff, leaveGym, removeStaff, TeamError } from "@/server/modules/team";
import { allow } from "@/server/rate-limit";
import { done, fail, invalid } from "./utils";

/** The current gym, only when the signed-in user owns it */
async function ownedCurrentGym() {
  const { user, gyms } = await getOwnerContext();
  const gym = user ? ownedGyms(user, gyms)[0] : undefined;
  return user && gym ? { user, gym } : null;
}

const inviteSchema = z.object({ email: z.email("email").max(200) });

export async function inviteStaffAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ctx = await ownedCurrentGym();
  if (!ctx) return fail("ownerOnly");
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, "validEmail");
  // Invites send email, so cap them
  if (!(await allow("staff-invite", ctx.user._id.toHexString(), 30, 86_400))) return fail("tooManyAttempts");
  try {
    await inviteStaff(ctx.user, ctx.gym, parsed.data.email);
  } catch (error) {
    if (error instanceof TeamError) return fail(error.key, error.values);
    throw error;
  }
  revalidatePath("/studio/team");
  return done("inviteSent", { email: parsed.data.email });
}

export async function cancelInviteAction(formData: FormData) {
  const ctx = await ownedCurrentGym();
  const id = toObjectId(formData.get("inviteId")?.toString());
  if (!ctx || !id) return;
  await cancelInvite(ctx.gym, id);
  revalidatePath("/studio/team");
}

export async function removeStaffAction(formData: FormData) {
  const ctx = await ownedCurrentGym();
  const id = toObjectId(formData.get("userId")?.toString());
  if (!ctx || !id) return;
  await removeStaff(ctx.gym, id);
  revalidatePath("/studio/team");
}

export async function acceptInviteAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  try {
    await acceptInvite(user, String(formData.get("token") ?? ""));
  } catch (error) {
    if (error instanceof TeamError) return fail(error.key, error.values);
    throw error;
  }
  revalidatePath("/studio", "layout");
  redirect("/studio/checkin");
}

export async function leaveGymAction(formData: FormData) {
  const user = await getSessionUser();
  const id = toObjectId(formData.get("gymId")?.toString());
  if (!user || !id) return;
  await leaveGym(user, id);
  revalidatePath("/studio", "layout");
  redirect("/studio/onboarding");
}
