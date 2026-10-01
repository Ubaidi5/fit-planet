import type { Region } from "./regions";

const moneyCache = new Map<string, Intl.NumberFormat>();

/** Formats an amount in the gym's currency using the viewer's locale */
export function formatMoney(amount: number, currency: string, locale = "en") {
  const key = `${locale}|${currency}`;
  let formatter = moneyCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    });
    moneyCache.set(key, formatter);
  }
  return formatter.format(amount);
}

export function formatNumber(value: number, locale = "en", options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

const KM_PER_MILE = 1.609344;

export function formatDistance(km: number, region: Pick<Region, "locale" | "units">) {
  const imperial = region.units === "imperial";
  const value = imperial ? km / KM_PER_MILE : km;
  return new Intl.NumberFormat(region.locale, {
    style: "unit",
    unit: imperial ? "mile" : "kilometer",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

/** "06:00" -> "6:00 AM" or "06:00" depending on the locale's clock */
export function formatClock(time: string, locale = "en") {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(Date.UTC(2000, 0, 1, h === 24 ? 0 : h, m));
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

/** Current local time in a gym's timezone, e.g. "18:42" */
export function localTimeIn(timeZone: string, locale = "en", date = new Date()) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone }).format(date);
}

export function countryName(code: string, locale = "en") {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Regional indicator emoji are avoided on purpose; codes read cleanly in mono */
export function formatPassDate(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" })
    .format(date)
    .toUpperCase();
}
