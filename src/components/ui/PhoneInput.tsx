"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HiOutlineChevronDown, HiOutlineExclamationCircle } from "react-icons/hi";

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 */
  iso: string;
  name: string;
  dial: string;
}

export const phoneCountries: PhoneCountry[] = [
  { iso: "PK", name: "Pakistan", dial: "92" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "IN", name: "India", dial: "91" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "US", name: "United States", dial: "1" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "ES", name: "Spain", dial: "34" },
  { iso: "PT", name: "Portugal", dial: "351" },
  { iso: "IT", name: "Italy", dial: "39" },
  { iso: "NL", name: "Netherlands", dial: "31" },
  { iso: "TR", name: "Türkiye", dial: "90" },
  { iso: "JP", name: "Japan", dial: "81" },
  { iso: "SG", name: "Singapore", dial: "65" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "NG", name: "Nigeria", dial: "234" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "BR", name: "Brazil", dial: "55" },
];

/** Generic international check: `+` then 7 to 15 digits, no leading zero */
export const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;

export function isValidPhone(value: string) {
  return PHONE_PATTERN.test(value.replace(/[\s-]/g, ""));
}

function findCountry(iso: string) {
  return phoneCountries.find((c) => c.iso === iso);
}

/** Splits an existing "+<dial><digits>" value into country and national part */
function parseValue(value: string | undefined) {
  if (!value || !value.startsWith("+")) return null;
  const digits = value.replace(/\D/g, "");
  const match = [...phoneCountries]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => digits.startsWith(c.dial));
  if (!match) return null;
  return { iso: match.iso, national: digits.slice(match.dial.length) };
}

export interface PhoneInputProps {
  label?: string;
  error?: string;
  hint?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Initial value as "+<dial><digits>"; the component keeps its own state */
  value?: string;
  /** Receives "+<dial><digits>", or "" while the number is empty */
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({
  label,
  error,
  hint,
  name,
  id,
  required,
  disabled,
  placeholder = "Phone number",
  value,
  onChange,
  className,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const selectId = `${inputId}-country`;
  const { region } = useLocale();

  const [initial] = useState(() => parseValue(value));
  const [pickedIso, setPickedIso] = useState<string | null>(
    initial?.iso ?? null,
  );
  const [national, setNational] = useState(initial?.national ?? "");

  // Follow the viewer's region until they pick a country themselves
  const regionIso = region.code.slice(0, 2).toUpperCase();
  const country =
    (pickedIso && findCountry(pickedIso)) ||
    findCountry(regionIso) ||
    findCountry("US")!;

  // Report the combined value whenever its parts change
  const lastEmitted = useRef<string | null>(value ?? null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    let digits = national.replace(/\D/g, "");
    // Drop the domestic trunk prefix ("0300..." -> "300..."), except Italy
    if (country.iso !== "IT") digits = digits.replace(/^0+/, "");
    const next = digits ? `+${country.dial}${digits}` : "";
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      onChangeRef.current(next);
    }
  }, [country.dial, country.iso, national]);

  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex h-12 w-full items-center rounded-xl border bg-surface shadow-[inset_0_1px_2px_oklch(0.25_0.06_265/0.04)]",
          "transition-[border-color,box-shadow] duration-200",
          "border-gray-200 hover:border-gray-300",
          "focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15",
          error &&
            "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/15",
          disabled && "cursor-not-allowed bg-gray-50 opacity-60",
        )}
      >
        <div className="relative ms-1.5 flex h-9 shrink-0 items-center gap-1 rounded-full bg-gray-900/[0.04] ps-3 pe-2 font-mono text-[13px] font-medium whitespace-nowrap text-gray-900 transition-colors hover:bg-gray-900/[0.07] has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-emerald-500/40">
          {/* Compact pill; the native select sits invisibly on top of it */}
          <span aria-hidden="true">+{country.dial}</span>
          <span
            aria-hidden="true"
            className="text-[10px] tracking-[0.1em] text-gray-400"
          >
            {country.iso}
          </span>
          <HiOutlineChevronDown
            aria-hidden="true"
            className="size-3.5 text-gray-400"
          />
          <label htmlFor={selectId} className="sr-only">
            Country code
          </label>
          <select
            id={selectId}
            value={country.iso}
            onChange={(e) => setPickedIso(e.target.value)}
            disabled={disabled}
            className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full opacity-0 focus:outline-none disabled:cursor-not-allowed"
          >
            {phoneCountries.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.name} (+{c.dial})
              </option>
            ))}
          </select>
        </div>

        <input
          id={inputId}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={national}
          onChange={(e) => setNational(e.target.value.replace(/[^\d\s-]/g, ""))}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          className="h-full min-w-0 flex-1 rounded-e-xl bg-transparent ps-3 pe-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 flex items-center gap-1 text-sm text-red-600"
        >
          <HiOutlineExclamationCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export default PhoneInput;
