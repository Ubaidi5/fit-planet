"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HiOutlineChevronDown } from "react-icons/hi";

export interface Option {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  options?: Option[];
  selectSize?: "sm" | "md" | "lg";
  wrapperClassName?: string;
}

export function Select({
  options,
  className,
  selectSize = "md",
  wrapperClassName,
  children,
  ...props
}: SelectProps) {
  const sizeClasses =
    selectSize === "sm"
      ? "h-9 px-3 text-sm"
      : selectSize === "lg"
        ? "h-12 px-4 text-base"
        : "h-10 px-4 text-sm";

  return (
    <div
      className={cn(
        "relative inline-block text-left w-full sm:w-auto",
        wrapperClassName,
      )}
    >
      <select
        {...props}
        className={cn(
          "appearance-none rounded-xl border border-gray-300 bg-white pr-10 text-black focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors",
          sizeClasses,
          className,
        )}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>

      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <HiOutlineChevronDown className="h-4 w-4" />
      </span>
    </div>
  );
}

export default Select;
