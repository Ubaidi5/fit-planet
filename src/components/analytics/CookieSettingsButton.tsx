"use client";

import { OPEN_CONSENT_EVENT, OPT_OUT_EVENT } from "@/lib/analytics/consent";

/**
 * Reopens the cookie banner so visitors can change their choice. With
 * `optOut`, it's the "Do not sell or share" link: advertising goes off first.
 */
export function CookieSettingsButton({ label, optOut, className }: { label: string; optOut?: boolean; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(optOut ? OPT_OUT_EVENT : OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  );
}
