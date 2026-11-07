"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { toObjectId } from "@/server/db/collections";
import { requireAdmin } from "@/server/session";
import {
  AdminError,
  adminCancelBooking,
  adminUpdateGym,
  deleteDemoGyms,
  deleteGym,
  moderateGym,
  resolveReport,
  setUserAdmin,
  setUserSuspended,
  suspendGym,
  transferGym,
} from "@/server/modules/admin";
import { reasonKeys } from "@/lib/suspension";

/** Result for forms that show a message next to their button */
export type AdminFormState = { ok: boolean; message: string } | null;

const messages: Record<string, string> = {
  accountNotFound: "No account with that email.",
  gymNotFound: "This gym no longer exists.",
  onlyConfirmedCancel: "Only confirmed passes can be cancelled.",
  cannotChangeOwnAccess: "You can't change your own admin access.",
  cannotSuspendSelf: "You can't suspend your own account.",
  gymHasBookings: "This gym has sold passes, so it can't be deleted. Hide or suspend it instead.",
};

function failed(error: unknown): AdminFormState {
  if (error instanceof AdminError) return { ok: false, message: messages[error.key] ?? "That didn't work." };
  throw error;
}

// Admin forms post straight to these; every one re-checks the admin first

const gymSchema = z.object({
  gymId: z.string(),
  action: z.enum(["verify", "unverify", "feature", "unfeature", "hide", "publish", "restore"]),
  note: z.string().trim().max(300).optional(),
});

export async function moderateGymAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = gymSchema.safeParse(Object.fromEntries(formData));
  const gymId = toObjectId(parsed.data?.gymId);
  if (!parsed.success || !gymId) return;
  try {
    await moderateGym(admin, gymId, parsed.data.action, parsed.data.note || undefined);
  } catch (error) {
    // A listing without photos can't go live; the buttons stay as they were
    if (!(error instanceof AdminError)) throw error;
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/gyms", "layout");
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

const restoreSchema = z.object({ userId: z.string() });

/** Lifts an account's suspension; suspending goes through suspendAction with a reason */
export async function setUserSuspendedAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = restoreSchema.safeParse(Object.fromEntries(formData));
  const userId = toObjectId(parsed.data?.userId);
  if (!parsed.success || !userId) return;
  try {
    await setUserSuspended(admin, userId, null);
  } catch (error) {
    if (!(error instanceof AdminError)) throw error;
  }
  revalidatePath("/admin", "layout");
}

const suspendSchema = z
  .object({
    target: z.enum(["user", "gym"]),
    id: z.string(),
    reason: z.enum(reasonKeys),
    details: z.string().trim().max(500).optional(),
  })
  .refine((v) => v.reason !== "other" || (v.details?.length ?? 0) >= 3, { path: ["details"] });

export async function suspendAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = suspendSchema.safeParse(Object.fromEntries(formData));
  const id = toObjectId(parsed.data?.id);
  if (!parsed.success || !id) return { ok: false, message: "Pick a reason, and write it out when you choose Other." };
  const input = { reason: parsed.data.reason, details: parsed.data.details || undefined };
  try {
    if (parsed.data.target === "user") await setUserSuspended(admin, id, input);
    else await suspendGym(admin, id, input);
  } catch (error) {
    return failed(error);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/gyms", "layout");
  return { ok: true, message: "Suspended. We emailed them the reason." };
}

const deleteGymSchema = z.object({ gymId: z.string() });

export async function deleteGymAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const gymId = toObjectId(deleteGymSchema.safeParse(Object.fromEntries(formData)).data?.gymId);
  if (!gymId) return { ok: false, message: messages.gymNotFound };
  try {
    const gym = await deleteGym(admin, gymId);
    revalidatePath(`/gyms/${gym.slug}`);
  } catch (error) {
    return failed(error);
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/gyms", "layout");
  redirect("/admin/gyms");
}

export async function deleteDemoGymsAction(_prev: AdminFormState): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const count = await deleteDemoGyms(admin);
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  return { ok: true, message: count ? `Removed ${count} sample studios.` : "There are no sample studios left." };
}

const adminRoleSchema = z.object({ userId: z.string(), grant: z.enum(["true", "false"]) });

export async function setUserAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = adminRoleSchema.safeParse(Object.fromEntries(formData));
  const userId = toObjectId(parsed.data?.userId);
  if (!parsed.success || !userId) return;
  try {
    await setUserAdmin(admin, userId, parsed.data.grant === "true");
  } catch (error) {
    if (!(error instanceof AdminError)) throw error;
  }
  revalidatePath("/admin", "layout");
}

const money = z.coerce.number().min(0).max(10_000_000);
const optional = (schema: z.ZodType<string>) => z.union([schema, z.literal("")]).optional();

const gymEditSchema = z.object({
  gymId: z.string(),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(300),
  street: z.string().trim().min(2).max(120),
  area: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(60),
  phone: optional(z.string().trim().max(30)),
  email: optional(z.email()),
  website: optional(z.url({ protocol: /^https?$/ })),
  capacity: z.coerce.number().int().min(1).max(5000),
  dayPass: money,
  weekPass: money,
  monthPass: money,
  note: z.string().trim().max(300).optional(),
});

const fieldNames: Record<string, string> = {
  name: "Name",
  description: "Short description (20 to 300 characters)",
  street: "Street",
  area: "Area",
  city: "City",
  email: "Email",
  website: "Website",
  capacity: "Capacity",
};

export async function adminUpdateGymAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = gymEditSchema.safeParse(Object.fromEntries(formData));
  const gymId = toObjectId(parsed.data?.gymId);
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? "");
    return { ok: false, message: `Check this field: ${fieldNames[field] ?? field}.` };
  }
  if (!gymId) return { ok: false, message: messages.gymNotFound };
  const { gymId: _, note, ...input } = parsed.data;
  try {
    const slug = await adminUpdateGym(admin, gymId, input, note || undefined);
    revalidatePath("/admin", "layout");
    revalidatePath(`/gyms/${slug}`);
    revalidatePath("/gyms");
    return { ok: true, message: "Changes saved." };
  } catch (error) {
    return failed(error);
  }
}

const transferSchema = z.object({ gymId: z.string(), email: z.email() });

export async function transferGymAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = transferSchema.safeParse(Object.fromEntries(formData));
  const gymId = toObjectId(parsed.data?.gymId);
  if (!parsed.success || !gymId) return { ok: false, message: "Enter the new owner's email." };
  try {
    await transferGym(admin, gymId, parsed.data.email);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Ownership moved. The previous owner stays on as staff." };
  } catch (error) {
    return failed(error);
  }
}

const cancelSchema = z.object({ bookingId: z.string(), note: z.string().trim().max(300).optional() });

export async function adminCancelBookingAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = cancelSchema.safeParse(Object.fromEntries(formData));
  const bookingId = toObjectId(parsed.data?.bookingId);
  if (!parsed.success || !bookingId) return;
  try {
    await adminCancelBooking(admin, bookingId, parsed.data.note || undefined);
  } catch (error) {
    // Already cancelled in another tab: the list refresh shows the current state
    if (!(error instanceof AdminError)) throw error;
  }
  revalidatePath("/admin", "layout");
}
