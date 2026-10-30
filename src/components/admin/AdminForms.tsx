"use client";

import { useActionState, useState } from "react";
import type { AdminFormState } from "@/actions/admin";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-xl bg-canvas px-3.5 text-[15px] text-ink ring-1 ring-gray-900/[0.08] outline-none placeholder:text-gray-400 focus:bg-surface focus:ring-2 focus:ring-emerald-500/40";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  className,
  ...rest
}: { label: string; name: string; defaultValue?: string | number; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-gray-600">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className={inputClass} {...rest} />
    </label>
  );
}

function Status({ state }: { state: AdminFormState }) {
  if (!state) return null;
  return (
    <p role="status" className={cn("text-sm font-medium", state.ok ? "text-emerald-700" : "text-red-700")}>
      {state.message}
    </p>
  );
}

function SubmitButton({ pending, children, tone = "primary" }: { pending: boolean; children: React.ReactNode; tone?: "primary" | "danger" }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "h-11 shrink-0 cursor-pointer rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors disabled:cursor-wait disabled:opacity-60",
        tone === "primary" ? "bg-ink text-white hover:bg-gray-800" : "bg-red-600 text-white hover:bg-red-700",
      )}
    >
      {children}
    </button>
  );
}

/** A form bound to an admin action that reports back with a message */
export function AdminForm({
  action,
  hidden,
  submit,
  className,
  children,
}: {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  hidden: Record<string, string>;
  submit: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Status state={state} />
        <SubmitButton pending={pending}>{pending ? "Saving…" : submit}</SubmitButton>
      </div>
    </form>
  );
}

/**
 * A button that asks once more before it posts, for steps that can't be undone
 * such as refunds. It swaps in place instead of opening a browser dialog.
 */
export function ConfirmAction({
  action,
  fields,
  label,
  confirm,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: string;
  confirm: string;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="h-9 cursor-pointer rounded-full bg-red-50 px-3.5 text-[13px] font-semibold whitespace-nowrap text-red-700 ring-1 ring-red-600/15 transition-colors hover:bg-red-100"
      >
        {label}
      </button>
    );
  }
  return (
    <form action={action} className="flex items-center gap-1.5">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="h-9 cursor-pointer rounded-full bg-red-600 px-3.5 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-red-700">
        {confirm}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="h-9 cursor-pointer rounded-full px-3 text-[13px] font-semibold text-gray-500 hover:text-ink">
        Keep
      </button>
    </form>
  );
}

/**
 * Suspend with a reason from the list, or "Other" with the admin's own words.
 * Opens in place under the button; the person gets the reason by email.
 */
export function SuspendForm({
  action,
  target,
  id,
  reasons,
}: {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  target: "user" | "gym";
  id: string;
  reasons: readonly { key: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [state, formAction, pending] = useActionState(action, null);
  if (!open || state?.ok) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 cursor-pointer rounded-full bg-red-50 px-3.5 text-[13px] font-semibold whitespace-nowrap text-red-700 ring-1 ring-red-600/15 transition-colors hover:bg-red-100"
      >
        Suspend
      </button>
    );
  }
  return (
    <form action={formAction} className="w-full basis-full space-y-3 rounded-2xl bg-red-50/60 p-4 ring-1 ring-red-600/10 sm:w-96 sm:basis-auto">
      <input type="hidden" name="target" value={target} />
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-gray-600">Reason</span>
        <select name="reason" required value={reason} onChange={(e) => setReason(e.target.value)} className={cn(inputClass, "cursor-pointer bg-surface pe-9")}>
          <option value="" disabled>
            Choose a reason
          </option>
          {reasons.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      {reason && (
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-gray-600">{reason === "other" ? "Write the reason" : "Details (optional)"}</span>
          <textarea
            name="details"
            rows={3}
            required={reason === "other"}
            minLength={reason === "other" ? 3 : undefined}
            maxLength={500}
            placeholder={reason === "other" ? "This goes in the email they receive" : "Added to the email after the reason"}
            className="w-full resize-y rounded-xl bg-surface px-3.5 py-3 text-[15px] text-ink ring-1 ring-gray-900/[0.08] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
      )}
      <p className="text-xs text-gray-500">{target === "user" ? "They are signed out everywhere" : "The listing leaves the site"} and get an email with the reason.</p>
      <Status state={state} />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="h-10 cursor-pointer rounded-full px-4 text-sm font-semibold text-gray-500 hover:text-ink">
          Cancel
        </button>
        <SubmitButton pending={pending} tone="danger">
          {pending ? "Suspending…" : "Suspend and email"}
        </SubmitButton>
      </div>
    </form>
  );
}

/** A destructive one-off (delete a gym, clear sample data) behind a second tap, with the result shown in place */
export function ConfirmForm({
  action,
  hidden = {},
  label,
  confirm,
  warning,
}: {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  hidden?: Record<string, string>;
  label: string;
  confirm: string;
  warning: string;
}) {
  const [asking, setAsking] = useState(false);
  const [state, formAction, pending] = useActionState(action, null);
  if (!asking || state?.ok) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setAsking(true)}
          className="h-10 cursor-pointer rounded-full bg-red-50 px-4 text-sm font-semibold whitespace-nowrap text-red-700 ring-1 ring-red-600/15 transition-colors hover:bg-red-100"
        >
          {label}
        </button>
        <Status state={state} />
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-3">
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <p className="text-sm text-red-700">{warning}</p>
      <Status state={state} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton pending={pending} tone="danger">
          {pending ? "Working…" : confirm}
        </SubmitButton>
        <button type="button" onClick={() => setAsking(false)} className="h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-gray-500 hover:text-ink">
          Keep
        </button>
      </div>
    </form>
  );
}
