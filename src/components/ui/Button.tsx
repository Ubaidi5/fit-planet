import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button variants using CVA (matching Fit Planet emerald/teal theme)
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center cursor-pointer",
    "rounded-xl font-semibold",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "relative overflow-hidden",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-emerald-600 text-white border border-emerald-600",
          "hover:bg-emerald-700 hover:border-emerald-700",
          "focus:ring-emerald-500/20",
          "shadow-sm hover:shadow-md",
        ],
        secondary: [
          "bg-teal-600 text-white border border-teal-600",
          "hover:bg-teal-700 hover:border-teal-700",
          "focus:ring-teal-500/20",
          "shadow-sm hover:shadow-md",
        ],
        success: [
          "bg-green-600 text-white border border-green-600",
          "hover:bg-green-700 hover:border-green-700",
          "focus:ring-green-500/20",
          "shadow-sm hover:shadow-md",
        ],
        warning: [
          "bg-amber-500 text-white border border-amber-500",
          "hover:bg-amber-600 hover:border-amber-600",
          "focus:ring-amber-400/20",
          "shadow-sm hover:shadow-md",
        ],
        danger: [
          "bg-red-600 text-white border border-red-600",
          "hover:bg-red-700 hover:border-red-700",
          "focus:ring-red-500/20",
          "shadow-sm hover:shadow-md",
        ],
        outline: [
          "bg-transparent text-gray-700 border border-gray-300",
          "hover:bg-gray-50 hover:border-gray-400",
          "focus:ring-gray-400/20",
          "shadow-sm",
        ],
        ghost: [
          "bg-transparent text-gray-700 border border-transparent",
          "hover:bg-gray-100 hover:text-gray-900",
          "focus:ring-gray-400/20",
        ],
        link: [
          "bg-transparent text-emerald-600 border border-transparent",
          "hover:text-emerald-700 hover:underline",
          "focus:ring-emerald-500/20",
          "shadow-none",
          "h-auto px-0",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        xl: "h-14 px-8 text-base gap-3",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Outline style variant (deprecated but kept for backward compatibility)
      {
        variant: "primary",
        className: "",
      },
    ],
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
 * Modern Button component matching Fit Planet theme (Emerald/Teal)
 *
 * Features:
 * - Primary: Emerald green (brand color)
 * - Secondary: Teal (secondary brand color)
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
            <span className={cn("shrink-0", children && "-ml-0.5")}>
              {beforeIcon}
            </span>
          )}
          {children && <span className="flex-1 truncate">{children}</span>}
          {afterIcon && (
            <span className={cn("shrink-0", children && "-mr-0.5")}>
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
