"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toObjectId } from "@/server/db/collections";
import { requireAdmin } from "@/server/session";
import { AdminError, moderateGym, resolveReport, setUserSuspended } from "@/server/modules/admin";

// Admin forms post straight to these; every one re-checks the admin first

const gymSchema = z.object({
  gymId: z.string(),
  action: z.enum(["verify", "unverify", "feature", "unfeature", "suspend", "restore"]),
  note: z.string().trim().max(300).optional(),
});

export async function moderateGymAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = gymSchema.safeParse(Object.fromEntries(formData));
  const gymId = toObjectId(parsed.data?.gymId);
  if (!parsed.success || !gymId) return;
  await moderateGym(admin, gymId, parsed.data.action, parsed.data.note || undefined);
  revalidatePath("/admin", "layout");
}

const reportSchema = z.object({ postId: z.string(), action: z.enum(["remove", "dismiss"]) });

export async function resolveReportAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = reportSchema.safeParse(Object.fromEntries(formData));
  const postId = toObjectId(parsed.data?.postId);
  if (!parsed.success || !postId) return;
  await resolveReport(admin, postId, parsed.data.action);
  revalidatePath("/admin", "layout");
}

const userSchema = z.object({
  userId: z.string(),
  suspend: z.enum(["true", "false"]),
  note: z.string().trim().max(300).optional(),
});

export async function setUserSuspendedAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  const userId = toObjectId(parsed.data?.userId);
  if (!parsed.success || !userId) return;
  try {
    await setUserSuspended(admin, userId, parsed.data.suspend === "true", parsed.data.note || undefined);
  } catch (error) {
    // Suspending yourself or a missing account: nothing to change
    if (!(error instanceof AdminError)) throw error;
  }
  revalidatePath("/admin", "layout");
}
