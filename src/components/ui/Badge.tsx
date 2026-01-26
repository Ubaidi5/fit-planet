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
        "inline-flex items-center font-medium rounded-full",
        // Size variants
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        // Color variants
        variant === "default" && "bg-gray-100 text-gray-700",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        variant === "warning" && "bg-amber-100 text-amber-700",
        variant === "danger" && "bg-red-100 text-red-700",
        variant === "info" && "bg-blue-100 text-blue-700",
        variant === "outline" &&
          "bg-transparent border border-gray-300 text-gray-600",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
