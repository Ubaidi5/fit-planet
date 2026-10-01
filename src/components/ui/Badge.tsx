import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "sm",
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full",
        // Size variants
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        // Color variants
        variant === "default" && "bg-gray-900/5 text-gray-700 ring-1 ring-gray-900/5",
        variant === "success" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15",
        variant === "warning" && "bg-amber-50 text-amber-700 ring-1 ring-amber-600/15",
        variant === "danger" && "bg-red-50 text-red-700 ring-1 ring-red-600/15",
        variant === "info" && "bg-sky-50 text-sky-700 ring-1 ring-sky-600/15",
        variant === "outline" &&
          "bg-transparent text-gray-600 ring-1 ring-gray-300",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
