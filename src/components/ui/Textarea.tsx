import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "w-full resize-y rounded-xl border px-4 py-2 transition-[border-color,box-shadow] duration-200",
    "placeholder:text-gray-400 focus:outline-none focus:ring-4",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-surface border-gray-200 text-gray-900 hover:border-gray-300",
          "focus:border-emerald-500 focus:ring-emerald-500/15",
        ],
        subtle: [
          "bg-gray-50 border-gray-200 text-gray-900",
          "focus:border-emerald-500 focus:ring-emerald-500/15",
        ],
        ghost: [
          "bg-transparent border-transparent text-gray-900",
          "focus:border-emerald-500 focus:ring-emerald-500/15",
        ],
        error: [
          "bg-white border-red-600 text-red-700",
          "focus:border-red-600 focus:ring-red-600/20",
        ],
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  hint?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export function Textarea({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  rows = 3,
  variant,
  size,
  className,
  disabled,
  ...props
}: TextareaProps) {
  const computedVariant = error ? "error" : variant;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center text-gray-400">
            {leftIcon}
          </div>
        )}

        <textarea
          rows={rows}
          className={cn(
            textareaVariants({ variant: computedVariant as any, size }),
            leftIcon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
          )}
          disabled={disabled}
          {...props}
        />

        {rightIcon && (
          <div className="pointer-events-none absolute right-3 top-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}

      {error && typeof error === "string" && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Textarea;
