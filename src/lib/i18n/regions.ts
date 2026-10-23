// Regional settings for the viewer. Prices stay in each gym's own currency;
// the region decides the interface language and how numbers, distances,
// weights, times and text direction look.

/** Languages the interface is translated into. Formatting can still follow any locale. */
export const APP_LOCALES = ["en", "de", "fr", "es", "tr", "ar"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export interface Region {
  /** ISO 3166-1 alpha-2, a "-XX" suffix for a second language in the same country, or "INTL" */
  code: string;
  name: string;
  /** BCP 47 locale used for Intl formatting of numbers, dates and money */
  locale: string;
  /** Interface language */
  lang: AppLocale;
  /** Language label shown in the switcher, in its own script */
  language: string;
  currency: string;
  dir: "ltr" | "rtl";
  /** Distances */
  units: "metric" | "imperial";
  /** Gym weights: the UK uses miles but kilograms */
  weight: "kg" | "lb";
}

export const regions: Region[] = [
  { code: "INTL", name: "International", locale: "en", lang: "en", language: "English", currency: "USD", dir: "ltr", units: "metric", weight: "kg" },
  { code: "US", name: "United States", locale: "en-US", lang: "en", language: "English", currency: "USD", dir: "ltr", units: "imperial", weight: "lb" },
  { code: "AU", name: "Australia", locale: "en-AU", lang: "en", language: "English", currency: "AUD", dir: "ltr", units: "metric", weight: "kg" },
  { code: "GB", name: "United Kingdom", locale: "en-GB", lang: "en", language: "English", currency: "GBP", dir: "ltr", units: "imperial", weight: "kg" },
  { code: "DE", name: "Deutschland", locale: "de-DE", lang: "de", language: "Deutsch", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "AT", name: "Österreich", locale: "de-AT", lang: "de", language: "Deutsch", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "CH", name: "Schweiz", locale: "de-CH", lang: "de", language: "Deutsch", currency: "CHF", dir: "ltr", units: "metric", weight: "kg" },
  { code: "FR", name: "France", locale: "fr-FR", lang: "fr", language: "Français", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "ES", name: "España", locale: "es-ES", lang: "es", language: "Español", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "NL", name: "Nederland", locale: "nl-NL", lang: "en", language: "English", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "IT", name: "Italia", locale: "it-IT", lang: "en", language: "English", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "PT", name: "Portugal", locale: "pt-PT", lang: "en", language: "English", currency: "EUR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "TR", name: "Türkiye", locale: "tr-TR", lang: "tr", language: "Türkçe", currency: "TRY", dir: "ltr", units: "metric", weight: "kg" },
  { code: "AE", name: "United Arab Emirates", locale: "en-AE", lang: "en", language: "English", currency: "AED", dir: "ltr", units: "metric", weight: "kg" },
  { code: "AE-AR", name: "الإمارات", locale: "ar-AE", lang: "ar", language: "العربية", currency: "AED", dir: "rtl", units: "metric", weight: "kg" },
  { code: "SA", name: "السعودية", locale: "ar-SA", lang: "ar", language: "العربية", currency: "SAR", dir: "rtl", units: "metric", weight: "kg" },
  { code: "PK", name: "Pakistan", locale: "en-PK", lang: "en", language: "English", currency: "PKR", dir: "ltr", units: "metric", weight: "kg" },
  { code: "JP", name: "日本", locale: "ja-JP", lang: "en", language: "English", currency: "JPY", dir: "ltr", units: "metric", weight: "kg" },
];

export const defaultRegion = regions[0];

export function findRegion(code: string | null | undefined) {
  return regions.find((region) => region.code === code) ?? null;
}

/** Best guess from the browser languages, e.g. "de-DE" -> Deutschland */
export function guessRegion(languages: readonly string[]): Region {
  for (const lang of languages) {
    const exact = regions.find((r) => r.locale.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;
  }
  for (const lang of languages) {
    const [language, country] = lang.split("-");
    const byCountry = country && regions.find((r) => r.code === country.toUpperCase());
    if (byCountry) return byCountry;
    const byLanguage = regions.find((r) => r.locale.split("-")[0] === language && r.code !== "INTL");
    if (byLanguage) return byLanguage;
  }
  return defaultRegion;
}

/** Cookie that carries the chosen region to the server */
export const REGION_COOKIE = "fp-region";

/** Parses an Accept-Language header into language tags, best first */
export function parseAcceptLanguage(header: string | null | undefined) {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim(), q: q ? Number(q) : 1 };
    })
    .filter((x) => x.tag && x.tag !== "*")
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}
