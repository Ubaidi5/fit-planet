"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/analytics/consent";

/** Reopens the cookie banner so visitors can change their choice */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  );
}
