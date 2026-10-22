"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelBookingAction } from "@/actions/bookings";
import { useToast } from "@/components/notifications/ToastProvider";

export function CancelBookingButton({ bookingId, refundNote }: { bookingId: string; refundNote: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
        Cancel booking
      </button>
    );
  }

  return (
    <div className="rounded-3xl bg-red-50 p-4 ring-1 ring-red-600/10">
      <p className="text-sm font-semibold text-red-800">Cancel this pass?</p>
      <p className="mt-1 text-sm text-red-700/80">{refundNote}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await cancelBookingAction(bookingId);
              if (result.ok) {
                toast.success("Booking cancelled");
                router.refresh();
              } else {
                toast.error("Couldn't cancel", result.error);
              }
              setConfirming(false);
            })
          }
          className="h-10 cursor-pointer rounded-full bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Cancelling..." : "Yes, cancel"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="h-10 cursor-pointer rounded-full px-4 text-sm font-semibold text-red-700 hover:bg-red-100">
          Keep it
        </button>
      </div>
    </div>
  );
}
