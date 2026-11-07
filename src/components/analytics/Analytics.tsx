"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { HiXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { applyConsent, flushServerEvents, saveConsent, setUserId, trackPageView } from "@/lib/analytics/browser";
import { hasTracking, OPEN_CONSENT_EVENT, type Consent, type TrackingConfig } from "@/lib/analytics/consent";

interface AnalyticsProps {
  config: TrackingConfig;
  /** The saved choice, read from the cookie on the server so the banner doesn't flash */
  initialConsent: Consent | null;
  userId?: string;
}

/**
 * Loads analytics and ad tags once the visitor agrees, tracks page views on
 * client-side navigation, and shows the cookie banner. Renders nothing when
 * no tracking ids are configured.
 */
export function Analytics({ config, initialConsent, userId }: AnalyticsProps) {
  const enabled = hasTracking(config);
  const [consent, setConsent] = useState(initialConsent);
  const [open, setOpen] = useState(enabled && !initialConsent);
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const tracked = useRef<string | null>(null);
  const lastUser = useRef(userId);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, show);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, show);
  }, []);

  // Runs before the page view effect below, so tags are loaded first
  useEffect(() => {
    if (!enabled || !consent) return;
    // Scripts can't be unloaded, so withdrawing consent reloads without them
    if (applyConsent(consent, config, lastUser.current)) window.location.reload();
  }, [enabled, consent, config]);

  useEffect(() => {
    if (!enabled || !consent || (!consent.analytics && !consent.ads)) return;
    const key = `${pathname}?${search}`;
    if (tracked.current === key) return;
    tracked.current = key;
    if (pathname.startsWith("/admin")) return;
    trackPageView();
    flushServerEvents();
  }, [enabled, consent, pathname, search]);

  useEffect(() => {
    if (lastUser.current === userId) return;
    lastUser.current = userId;
    setUserId(userId);
  }, [userId]);

  if (!enabled || !open) return null;
  return (
    <ConsentBanner
      current={consent}
      onClose={consent ? () => setOpen(false) : undefined}
      onChoose={(next) => {
        saveConsent(next);
        setConsent(next);
        setOpen(false);
      }}
    />
  );
}

function ConsentBanner({ current, onChoose, onClose }: { current: Consent | null; onChoose: (consent: Consent) => void; onClose?: () => void }) {
  const t = useTranslations("consent");
  const [customizing, setCustomizing] = useState(Boolean(current));
  const [choice, setChoice] = useState<Consent>(current ?? { analytics: true, ads: true });

  const rows = [
    { key: "necessary", locked: true },
    { key: "analytics", locked: false },
    { key: "ads", locked: false },
  ] as const;

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-60 animate-fade-up sm:inset-x-auto sm:start-4 sm:bottom-4 sm:w-[25.5rem]"
    >
      <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-4xl bg-surface p-5 shadow-lift ring-1 ring-gray-900/[0.08] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-volt ring-2 ring-volt-soft" />
            {t("label")}
          </p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="-me-2 -mt-1 flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-900/[0.05] hover:text-ink"
            >
              <HiXMark className="size-5" />
            </button>
          )}
        </div>

        <h2 id="consent-title" className="mt-2 text-lg leading-snug font-semibold tracking-[-0.02em] text-ink">
          {t("title")}
        </h2>
        <p id="consent-text" className="mt-1.5 text-sm leading-relaxed text-gray-600">
          {t.rich("body", {
            link: (chunks) => (
              <Link href="/privacy#cookies" className="font-medium text-ink underline underline-offset-2 hover:text-emerald-700">
                {chunks}
              </Link>
            ),
          })}
        </p>

        {customizing && (
          <ul className="mt-4 divide-y divide-gray-900/[0.06] rounded-3xl bg-canvas/70 ring-1 ring-gray-900/[0.05]">
            {rows.map(({ key, locked }) => (
              <li key={key} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p id={`consent-${key}`} className="text-sm font-semibold text-ink">
                    {t(`${key}.title`)}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{t(`${key}.text`)}</p>
                </div>
                {locked ? (
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] leading-5 tracking-[0.12em] text-gray-400 uppercase">{t("alwaysOn")}</span>
                ) : (
                  <Switch
                    labelledBy={`consent-${key}`}
                    checked={choice[key]}
                    onChange={(value) => setChoice((prev) => ({ ...prev, [key]: value }))}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Reject and accept carry equal weight, as EU regulators expect */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChoose({ analytics: false, ads: false })}
            className="flex h-11 cursor-pointer items-center justify-center rounded-full bg-surface px-4 text-sm font-semibold text-ink ring-1 ring-gray-900/15 transition-colors hover:bg-gray-900/[0.04] active:scale-[0.98]"
          >
            {t("rejectAll")}
          </button>
          <button
            type="button"
            onClick={() => onChoose({ analytics: true, ads: true })}
            className="flex h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-gray-800 active:scale-[0.98]"
          >
            {t("acceptAll")}
          </button>
        </div>
        <button
          type="button"
          onClick={() => (customizing ? onChoose(choice) : setCustomizing(true))}
          className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          {customizing ? t("save") : t("customize")}
        </button>
      </div>
    </div>
  );
}

function Switch({ checked, onChange, labelledBy }: { checked: boolean; onChange: (value: boolean) => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative mt-0.5 inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        checked ? "bg-ink" : "bg-gray-300",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-5 rounded-full shadow-soft transition-transform duration-300 ease-out-expo",
          checked ? "translate-x-4 bg-volt rtl:-translate-x-4" : "bg-white",
        )}
      />
    </button>
  );
}
