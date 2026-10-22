"use client";

import { useFormStatus } from "react-dom";
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from "react-icons/hi2";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Submit button that shows a spinner while its form's action runs */
export function SubmitButton({ children, pendingLabel, className, ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" fullWidth loading={pending} loadingText={pendingLabel ?? "Working..."} className={className} {...props}>
      {children}
    </Button>
  );
}

export function FormAlert({ tone = "error", children, className }: { tone?: "error" | "success"; children: React.ReactNode; className?: string }) {
  const Icon = tone === "error" ? HiOutlineExclamationCircle : HiOutlineCheckCircle;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm",
        tone === "error" ? "bg-red-50 text-red-700 ring-1 ring-red-600/10" : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-medium text-gray-400">
      <span className="h-px flex-1 bg-gray-900/[0.08]" />
      {label}
      <span className="h-px flex-1 bg-gray-900/[0.08]" />
    </div>
  );
}
