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
