"use client";

import { useActionState, useState } from "react";
import { HiStar } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { submitReviewAction } from "@/actions/member";
import { Input } from "@/components/ui/Input";
import { FormAlert, SubmitButton } from "@/components/auth/FormBits";

const categories = [
  ["cleanliness", "Cleanliness"],
  ["equipment", "Equipment"],
  ["staff", "Staff"],
  ["value", "Value"],
] as const;

function StarPicker({ name, value, onChange, size = "md" }: { name: string; value: number; onChange: (v: number) => void; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label={name}>
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className="cursor-pointer p-0.5 transition-transform active:scale-90"
        >
          <HiStar className={cn(size === "md" ? "size-8" : "size-5", star <= value ? "text-stamp-ochre" : "text-gray-200")} />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ gymId, gymName }: { gymId: string; gymName: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(submitReviewAction, null);
  const [rating, setRating] = useState(5);
  const [scores, setScores] = useState({ cleanliness: 5, equipment: 5, staff: 5, value: 5 });
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  if (state?.ok) return <FormAlert tone="success">{state.message}</FormAlert>;

  if (!open) {
    return (
      <div className="flex flex-col items-start justify-between gap-4 rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold text-ink">How was {gymName}?</h3>
          <p className="mt-0.5 text-sm text-gray-500">Your review helps travellers pick the right gym.</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 shrink-0 cursor-pointer items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800">
          Write a review
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft sm:p-8">
      <input type="hidden" name="gymId" value={gymId} />
      {state && !state.ok && !state.fieldErrors && <FormAlert>{state.error}</FormAlert>}
      <div>
        <p className="text-sm font-medium text-gray-700">Overall</p>
        <StarPicker name="rating" value={rating} onChange={setRating} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-2.5">
            <span className="text-sm text-gray-700">{label}</span>
            <StarPicker name={key} size="sm" value={scores[key]} onChange={(v) => setScores((s) => ({ ...s, [key]: v }))} />
          </div>
        ))}
      </div>
      <Input label="Headline" name="title" placeholder="Great equipment, never too crowded" error={errors?.title} maxLength={80} required />
      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-gray-700">
          Your review
        </label>
        <textarea
          id="review-comment"
          name="comment"
          rows={4}
          maxLength={1500}
          placeholder="What stood out? Anything travellers should know?"
          className={cn(
            "block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none",
            errors?.comment && "border-red-500",
          )}
          required
        />
        {errors?.comment && <p className="mt-1.5 text-sm text-red-600">{errors.comment}</p>}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => setOpen(false)} className="h-12 cursor-pointer rounded-full px-5 text-sm font-medium text-gray-600 hover:bg-gray-900/5">
          Cancel
        </button>
        <div className="sm:w-48">
          <SubmitButton variant="secondary" pendingLabel="Posting...">
            Post review
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
