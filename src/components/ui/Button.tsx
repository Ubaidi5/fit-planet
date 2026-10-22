import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button variants using CVA (matching Fit Planet emerald/teal theme)
const buttonVariants = cva(
  // Base styles
  [
    "group/button relative inline-flex cursor-pointer items-center justify-center overflow-hidden",
    "rounded-full font-medium tracking-tight whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-expo",
    "focus-visible:outline-none focus-visible:ring-4",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-emerald-600 text-white",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.18),0_1px_2px_oklch(0.25_0.06_265/0.12)]",
          "hover:bg-emerald-700 hover:shadow-glow",
          "focus-visible:ring-emerald-500/25",
        ],
        secondary: [
          "bg-ink text-white",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.12),0_1px_2px_oklch(0.25_0.06_265/0.2)]",
          "hover:bg-gray-800",
          "focus-visible:ring-gray-900/20",
        ],
        success: [
          "bg-emerald-600 text-white",
          "hover:bg-emerald-700",
          "focus-visible:ring-emerald-500/25",
        ],
        warning: [
          "bg-amber-500 text-white",
          "hover:bg-amber-600",
          "focus-visible:ring-amber-400/25",
        ],
        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "focus-visible:ring-red-500/25",
        ],
        outline: [
          "border border-gray-200 bg-surface text-gray-800 shadow-soft",
          "hover:border-gray-300 hover:bg-white hover:text-ink",
          "focus-visible:ring-gray-400/20",
        ],
        ghost: [
          "bg-transparent text-gray-700",
          "hover:bg-gray-900/5 hover:text-ink",
          "focus-visible:ring-gray-400/20",
        ],
        volt: [
          "bg-volt text-ink",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.4),0_1px_2px_oklch(0.25_0.06_265/0.12)]",
          "hover:brightness-95",
          "focus-visible:ring-lime-400/40",
        ],
        link: [
          "bg-transparent text-emerald-700",
          "hover:text-emerald-800 hover:underline underline-offset-4",
          "focus-visible:ring-emerald-500/20",
          "h-auto px-0",
        ],
      },
      size: {
        sm: "h-9 px-3.5 text-sm gap-1.5",
        md: "h-10 px-4.5 text-sm gap-2",
        lg: "h-12 px-6 text-[15px] gap-2.5",
        xl: "h-14 px-8 text-base gap-3",
        icon: "size-10 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

// Loading spinner component
const LoadingSpinner = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const spinnerSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <svg
      className={cn("animate-spin", spinnerSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Button component interface
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Icon to display before the button text */
  beforeIcon?: React.ReactNode;
  /** Icon to display after the button text */
  afterIcon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Loading text to display when loading */
  loadingText?: string;
  /** Custom class name */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * Pill button in the Fit Planet style
 *
 * Features:
 * - Primary: emerald brand, Secondary: ink, Volt: lime highlight
 * - Success, Warning, Danger variants for different actions
 * - Outline and Ghost for subtle CTAs
 * - Multiple sizes (sm, md, lg, xl, icon)
 * - Before/after icons support
 * - Loading states with spinner
 * - Full width option
 * - Accessibility features
 * - Smooth animations
 *
 * @example
 * ```tsx
 * <Button>Book Now</Button>
 * <Button variant="outline">Cancel</Button>
 * <Button size="lg" beforeIcon={<Icon />}>Get Started</Button>
 * <Button loading loadingText="Saving...">Save</Button>
 * ```
 */
export function Button({
  className,
  variant,
  size,
  fullWidth,
  beforeIcon,
  afterIcon,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner
            size={
              size === "sm"
                ? "sm"
                : size === "lg" || size === "xl"
                  ? "lg"
                  : "md"
            }
          />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        <>
          {beforeIcon && (
            <span className={cn("shrink-0", children && "-ms-0.5")}>
              {beforeIcon}
            </span>
          )}
          {children && <span className="inline-flex flex-1 items-center truncate">{children}</span>}
          {afterIcon && (
            <span className={cn("shrink-0", children && "-me-0.5")}>
              {afterIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// Export variants for external use
export { buttonVariants };
export type { VariantProps };
