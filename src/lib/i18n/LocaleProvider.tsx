"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultRegion, findRegion, guessRegion, type Region } from "./regions";
import { formatClock, formatDistance, formatMoney, formatNumber } from "./format";

const STORAGE_KEY = "fp-region";

interface LocaleContextValue {
  region: Region;
  setRegion: (code: string) => void;
  money: (amount: number, currency: string) => string;
  distance: (km: number) => string;
  clock: (time: string) => string;
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render use the neutral region so markup matches;
  // the viewer's saved or guessed region is applied right after hydration.
  const [region, setRegionState] = useState<Region>(defaultRegion);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }
    const next = findRegion(saved) ?? guessRegion(navigator.languages ?? [navigator.language]);
    if (next.code !== defaultRegion.code) setRegionState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = region.locale;
    document.documentElement.dir = region.dir;
  }, [region]);

  const setRegion = useCallback((code: string) => {
    const next = findRegion(code);
    if (!next) return;
    setRegionState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Storage can be blocked; the choice still applies for this visit
    }
  }, []);

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
