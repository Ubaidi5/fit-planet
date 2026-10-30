"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toObjectId } from "@/server/db/collections";
import { requireAdmin } from "@/server/session";
import {
  AdminError,
  adminCancelBooking,
  adminUpdateGym,
  moderateGym,
  resolveReport,
  setUserAdmin,
  setUserSuspended,
  transferGym,
} from "@/server/modules/admin";

/** Result for forms that show a message next to their button */
export type AdminFormState = { ok: boolean; message: string } | null;

const messages: Record<string, string> = {
  accountNotFound: "No account with that email.",
  gymNotFound: "This gym no longer exists.",
  onlyConfirmedCancel: "Only confirmed passes can be cancelled.",
  cannotChangeOwnAccess: "You can't change your own admin access.",
};

function failed(error: unknown): AdminFormState {
  if (error instanceof AdminError) return { ok: false, message: messages[error.key] ?? "That didn't work." };
  throw error;
}

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
