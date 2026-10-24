"use client";

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { defaultRegion, findRegion, REGION_COOKIE, type Region } from "./regions";
import { formatClock, formatDistance, formatMoney, formatNumber } from "./format";

interface LocaleContextValue {
  region: Region;
  setRegion: (code: string) => void;
  money: (amount: number, currency: string) => string;
  distance: (km: number) => string;
  clock: (time: string) => string;
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * The region is resolved on the server (cookie, then Accept-Language) so the
 * first render is already in the viewer's language. Switching writes the
 * cookie and refreshes server components so translations follow.
 */
export function LocaleProvider({ initialRegion, children }: { initialRegion: string; children: React.ReactNode }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [region, setRegionState] = useState<Region>(() => findRegion(initialRegion) ?? defaultRegion);

  const setRegion = useCallback(
    (code: string) => {
      const next = findRegion(code);
      if (!next) return;
      setRegionState(next);
      document.cookie = `${REGION_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      document.documentElement.lang = next.locale;
      document.documentElement.dir = next.dir;
      startTransition(() => router.refresh());
    },
    [router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      region,
      setRegion,
      money: (amount, currency) => formatMoney(amount, currency, region.locale),
      distance: (km) => formatDistance(km, region),
      clock: (time) => formatClock(time, region.locale),
      number: (value, options) => formatNumber(value, region.locale, options),
    }),
    [region, setRegion],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

const fallback: LocaleContextValue = {
  region: defaultRegion,
  setRegion: () => {},
  money: (amount, currency) => formatMoney(amount, currency, defaultRegion.locale),
  distance: (km) => formatDistance(km, defaultRegion),
  clock: (time) => formatClock(time, defaultRegion.locale),
  number: (value, options) => formatNumber(value, defaultRegion.locale, options),
};

/** Locale helpers; falls back to the neutral region outside the provider */
export function useLocale() {
  return useContext(LocaleContext) ?? fallback;
}
