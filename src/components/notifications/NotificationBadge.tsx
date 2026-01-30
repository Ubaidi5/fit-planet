"use client";

import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "warning";
  dot?: boolean;
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  size = "md",
  variant = "primary",
  dot = false,
  className,
}: NotificationBadgeProps) {
  if (count === 0 && !dot) return null;

  const sizeClasses = {
    sm: "h-4 min-w-[1rem] text-[10px] px-1",
    md: "h-5 min-w-[1.25rem] text-xs px-1.5",
    lg: "h-6 min-w-[1.5rem] text-sm px-2",
  };

  const dotSizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const variantClasses = {
    primary: "bg-emerald-500 text-white",
    secondary: "bg-blue-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-amber-500 text-white",
  };

  if (dot) {
    return (
      <span
        className={cn(
          "absolute right-0 top-0 block rounded-full ring-2 ring-white",
          dotSizeClasses[size],
          variantClasses[variant],
          className,
        )}
      />
    );
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={cn(
        "absolute -right-1 -top-1 flex items-center justify-center rounded-full font-bold tabular-nums ring-2 ring-white",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {displayCount}
    </span>
  );
}

interface NotificationBadgeIconProps {
  count: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "warning";
  showDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NotificationBadgeIcon({
  count,
  size = "md",
  variant = "primary",
  showDot = false,
  className,
  onClick,
}: NotificationBadgeIconProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
    >
      <svg
        className={cn(iconSizes[size])}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      <NotificationBadge
        count={count}
        size={size}
        variant={variant}
        dot={showDot && count === 0}
      />
    </button>
  );
}
