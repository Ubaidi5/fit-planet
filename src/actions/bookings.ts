"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { BookingError, cancelBookingByMember, createBooking } from "@/server/modules/bookings";
import { done, fail, invalid } from "./utils";
import { allow } from "@/server/rate-limit";
import { reportError } from "@/lib/monitoring";

const bookingSchema = z.object({
  gymId: z.string().min(1),
  passType: z.enum(["day", "week", "month"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "startDate"),
  paymentMethod: z.enum(["online", "desk"]),
  guestName: z.string().trim().min(2, "guestName").max(80),
  guestPhone: z.string().trim().max(24).optional(),
});

/** Creates a booking and sends the member to pay (or straight to their pass for desk payment) */
export async function bookPassAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInToBook");
  if (!(await allow("book", user._id.toHexString(), 20, 3600))) return fail("tooManyAttempts");

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  const gymId = toObjectId(parsed.data.gymId);
  if (!gymId) return fail("gymNotFound");

  let destination: string;
  try {
    const result = await createBooking({ ...parsed.data, user, gymId });
    destination = result.checkoutUrl ?? `/app/passes/${result.bookingId}?new=1`;
  } catch (error) {
    if (error instanceof BookingError) return fail(error.key, error.values);
    reportError("[booking] create failed", error);
    return fail("bookingCrashed");
  }
  redirect(destination);
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  const id = toObjectId(bookingId);
  if (!user || !id) return fail("bookingNotFound");
  try {
    await cancelBookingByMember(user._id, id);
  } catch (error) {
    if (error instanceof BookingError) return fail(error.key, error.values);
    reportError("[booking] cancel failed", error);
    return fail("cancelFailed");
  }
  revalidatePath("/app/passes");
  revalidatePath(`/app/passes/${bookingId}`);
  return done("bookingCancelled");
}
