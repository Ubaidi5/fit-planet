// Regional settings for the viewer. Prices stay in each gym's own currency;
// the region decides how numbers, distances, times and text direction look.

export interface Region {
  /** ISO 3166-1 alpha-2, or "INTL" for the neutral default */
  code: string;
  name: string;
  /** BCP 47 locale used for Intl formatting */
  locale: string;
  /** Language label shown in the switcher, in its own script */
  language: string;
  currency: string;
  dir: "ltr" | "rtl";
  units: "metric" | "imperial";
}

export const regions: Region[] = [
  { code: "INTL", name: "International", locale: "en", language: "English", currency: "USD", dir: "ltr", units: "metric" },
  { code: "PK", name: "Pakistan", locale: "en-PK", language: "English", currency: "PKR", dir: "ltr", units: "metric" },
  { code: "PK-UR", name: "پاکستان", locale: "ur-PK", language: "اردو", currency: "PKR", dir: "rtl", units: "metric" },
  { code: "AE", name: "United Arab Emirates", locale: "en-AE", language: "English", currency: "AED", dir: "ltr", units: "metric" },
  { code: "AE-AR", name: "الإمارات", locale: "ar-AE", language: "العربية", currency: "AED", dir: "rtl", units: "metric" },
  { code: "JP", name: "日本", locale: "ja-JP", language: "日本語", currency: "JPY", dir: "ltr", units: "metric" },
  { code: "DE", name: "Deutschland", locale: "de-DE", language: "Deutsch", currency: "EUR", dir: "ltr", units: "metric" },
  { code: "PT", name: "Portugal", locale: "pt-PT", language: "Português", currency: "EUR", dir: "ltr", units: "metric" },
  { code: "GB", name: "United Kingdom", locale: "en-GB", language: "English", currency: "GBP", dir: "ltr", units: "imperial" },
  { code: "US", name: "United States", locale: "en-US", language: "English", currency: "USD", dir: "ltr", units: "imperial" },
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
