"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { BookingError, cancelBookingByMember, createBooking } from "@/server/modules/bookings";
import { fieldErrors } from "./utils";

const bookingSchema = z.object({
  gymId: z.string().min(1),
  passType: z.enum(["day", "week", "month"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a start date"),
  paymentMethod: z.enum(["online", "desk"]),
  guestName: z.string().trim().min(2, "Enter the name for the pass").max(80),
  guestPhone: z.string().trim().max(24).optional(),
});

/** Creates a booking and sends the member to pay (or straight to their pass for desk payment) */
export async function bookPassAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sign in to book a pass." };

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const gymId = toObjectId(parsed.data.gymId);
  if (!gymId) return { ok: false, error: "Gym not found." };

  let destination: string;
  try {
    const result = await createBooking({ ...parsed.data, user, gymId });
    destination = result.checkoutUrl ?? `/app/passes/${result.bookingId}?new=1`;
  } catch (error) {
    if (error instanceof BookingError) return { ok: false, error: error.message };
    console.error("[booking] create failed", error);
    return { ok: false, error: "Something went wrong while booking. You haven't been charged." };
  }
  redirect(destination);
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  const id = toObjectId(bookingId);
  if (!user || !id) return { ok: false, error: "Booking not found." };
  try {
    await cancelBookingByMember(user._id, id);
  } catch (error) {
    if (error instanceof BookingError) return { ok: false, error: error.message };
    console.error("[booking] cancel failed", error);
    return { ok: false, error: "Couldn't cancel this booking. Please try again." };
  }
  revalidatePath("/app/passes");
  revalidatePath(`/app/passes/${bookingId}`);
  return { ok: true, message: "Booking cancelled." };
}
