"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              "block w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              // Default border
              "border-gray-300",
              // Focus state
              "focus:border-emerald-500 focus:ring-emerald-500/20",
              // Error state
              error && [
                "border-red-500",
                "focus:border-red-500 focus:ring-red-500/20",
              ],
              // Disabled state
              disabled && "cursor-not-allowed bg-gray-50 opacity-60",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 flex items-center gap-1 text-sm text-red-600"
          >
            <HiOutlineExclamationCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {/* Hint Text */}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
