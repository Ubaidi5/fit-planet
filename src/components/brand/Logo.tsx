import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** Small label rendered next to the wordmark, e.g. "Studio" */
  tag?: string;
  compact?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink text-volt shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="size-[62%]" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.6" />
        <path
          d="M4.5 19.5c6-3.2 16.8-3.2 23 0"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="16" cy="11.5" r="2.6" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", className, tag, compact }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Fit Planet home"
    >
      <LogoMark className="transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-105" />
      {!compact && (
        <span className="flex items-center gap-2">
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            Fit Planet
          </span>
          {tag && (
            <span className="rounded-md bg-volt-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
              {tag}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
