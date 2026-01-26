import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button variants using CVA
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center cursor-pointer",
    "rounded-lg font-medium",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "relative overflow-hidden",
    "active:scale-95",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-white border border-primary",
          "hover:bg-primary/80 hover:border-primary/80",
          "focus:ring-primary/20",
          "shadow-sm hover:shadow-md",
        ],
        secondary: [
          "bg-secondary text-white border border-secondary",
          "hover:bg-secondary/80 hover:border-secondary/80",
          "focus:ring-secondary/20",
          "shadow-sm hover:shadow-md",
        ],
        success: [
          "bg-green-600 text-white border border-green-600",
          "hover:bg-green-700 hover:border-green-700",
          "focus:ring-green-500/20",
          "shadow-sm hover:shadow-md",
        ],
        warning: [
          "bg-warning text-white border border-warning",
          "hover:bg-warning/80 hover:border-warning/80",
          "focus:ring-warning/20",
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
          "focus:ring-gray-500/20",
          "shadow-sm",
        ],
        ghost: [
          "bg-transparent text-gray-700 border border-transparent",
          "hover:bg-gray-100 hover:text-gray-900",
          "focus:ring-gray-500/20",
        ],
        link: [
          "bg-transparent text-primary border border-transparent",
          "hover:text-primary hover:underline",
          "focus:ring-primary/20",
          "shadow-none",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        xl: "h-14 px-8 text-lg gap-3",
        icon: "h-10 w-10 p-0",
      },
      outline: {
        true: "",
        false: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    compoundVariants: [
      // Primary outline variants
      {
        variant: "primary",
        outline: true,
        className: [
          "bg-transparent text-primary border-primary",
          "hover:bg-primary hover:text-white",
          "focus:ring-primary/20",
        ],
      },
      // Secondary outline variants
      {
        variant: "secondary",
        outline: true,
        className: [
          "bg-transparent text-secondary border-secondary",
          "hover:bg-secondary hover:text-white",
          "focus:ring-secondary/20",
        ],
      },
      // Success outline variants
      {
        variant: "success",
        outline: true,
        className: [
          "bg-transparent text-green-600 border-green-600",
          "hover:bg-green-600 hover:text-white",
          "focus:ring-green-500/20",
        ],
      },
      // Warning outline variants
      {
        variant: "warning",
        outline: true,
        className: [
          "bg-transparent text-warning border-warning",
          "hover:bg-warning hover:text-white",
          "focus:ring-warning/20",
        ],
      },
      // Danger outline variants
      {
        variant: "danger",
        outline: true,
        className: [
          "bg-transparent text-danger border-danger",
          "hover:bg-danger hover:text-white",
          "focus:ring-danger/20",
        ],
      },
      // Icon size adjustments
      {
        size: "icon",
        variant: ["primary", "secondary", "success", "warning", "danger"],
        className: "rounded-lg",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      outline: false,
      rounded: "lg",
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
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Custom class name */
  className?: string;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * Modern Button component with Tailwind CSS and CVA variants
 *
 * Features:
 * - Multiple variants (primary, secondary, success, warning, danger, ghost, link)
 * - Outline variants for each color
 * - Multiple sizes (sm, md, lg, xl, icon)
 * - Before/after icons
 * - Loading states
 * - Full width option
 * - Customizable border radius
 * - Accessibility features
 * - Smooth animations
 */
export function Button({
  className,
  variant,
  size,
  outline,
  rounded,
  beforeIcon,
  afterIcon,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, outline, rounded }),
        fullWidth && "w-full",
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <LoadingSpinner
          size={
            size === "sm" ? "sm" : size === "lg" || size === "xl" ? "lg" : "md"
          }
        />
      ) : (
        beforeIcon && (
          <span className={cn("shrink-0", children && "mr-1")}>
            {beforeIcon}
          </span>
        )
      )}
      {children && <span className="flex-1 truncate">{children}</span>}
      {afterIcon && (
        <span className={cn("shrink-0", children && "ml-1")}>{afterIcon}</span>
      )}
    </button>
  );
}

// Export variants for external use
export { buttonVariants };
export type { VariantProps };
