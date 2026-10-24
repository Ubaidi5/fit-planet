// Countries offered when a gym signs up, with sensible currency and timezone
// defaults. Owners can still change currency and timezone individually.

export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  timezone: string;
  /** Rough centre, used when the owner doesn't share a location */
  center: [number, number];
}

export const countries: CountryOption[] = [
  { code: "PK", name: "Pakistan", currency: "PKR", timezone: "Asia/Karachi", center: [24.86, 67.0] },
  { code: "AE", name: "United Arab Emirates", currency: "AED", timezone: "Asia/Dubai", center: [25.2, 55.27] },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", timezone: "Asia/Riyadh", center: [24.71, 46.67] },
  { code: "QA", name: "Qatar", currency: "QAR", timezone: "Asia/Qatar", center: [25.29, 51.53] },
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata", center: [19.07, 72.88] },
  { code: "BD", name: "Bangladesh", currency: "BDT", timezone: "Asia/Dhaka", center: [23.81, 90.41] },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London", center: [51.51, -0.13] },
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York", center: [40.71, -74.0] },
  { code: "CA", name: "Canada", currency: "CAD", timezone: "America/Toronto", center: [43.65, -79.38] },
  { code: "DE", name: "Germany", currency: "EUR", timezone: "Europe/Berlin", center: [52.52, 13.4] },
  { code: "FR", name: "France", currency: "EUR", timezone: "Europe/Paris", center: [48.86, 2.35] },
  { code: "ES", name: "Spain", currency: "EUR", timezone: "Europe/Madrid", center: [40.42, -3.7] },
  { code: "IT", name: "Italy", currency: "EUR", timezone: "Europe/Rome", center: [41.9, 12.5] },
  { code: "PT", name: "Portugal", currency: "EUR", timezone: "Europe/Lisbon", center: [38.72, -9.14] },
  { code: "NL", name: "Netherlands", currency: "EUR", timezone: "Europe/Amsterdam", center: [52.37, 4.9] },
  { code: "IE", name: "Ireland", currency: "EUR", timezone: "Europe/Dublin", center: [53.35, -6.26] },
  { code: "TR", name: "Türkiye", currency: "TRY", timezone: "Europe/Istanbul", center: [41.01, 28.98] },
  { code: "EG", name: "Egypt", currency: "EGP", timezone: "Africa/Cairo", center: [30.04, 31.24] },
  { code: "NG", name: "Nigeria", currency: "NGN", timezone: "Africa/Lagos", center: [6.52, 3.38] },
  { code: "KE", name: "Kenya", currency: "KES", timezone: "Africa/Nairobi", center: [-1.29, 36.82] },
  { code: "ZA", name: "South Africa", currency: "ZAR", timezone: "Africa/Johannesburg", center: [-26.2, 28.05] },
  { code: "JP", name: "Japan", currency: "JPY", timezone: "Asia/Tokyo", center: [35.68, 139.69] },
  { code: "KR", name: "South Korea", currency: "KRW", timezone: "Asia/Seoul", center: [37.57, 126.98] },
  { code: "SG", name: "Singapore", currency: "SGD", timezone: "Asia/Singapore", center: [1.35, 103.82] },
  { code: "MY", name: "Malaysia", currency: "MYR", timezone: "Asia/Kuala_Lumpur", center: [3.14, 101.69] },
  { code: "ID", name: "Indonesia", currency: "IDR", timezone: "Asia/Jakarta", center: [-6.21, 106.85] },
  { code: "TH", name: "Thailand", currency: "THB", timezone: "Asia/Bangkok", center: [13.76, 100.5] },
  { code: "PH", name: "Philippines", currency: "PHP", timezone: "Asia/Manila", center: [14.6, 120.98] },
  { code: "AU", name: "Australia", currency: "AUD", timezone: "Australia/Sydney", center: [-33.87, 151.21] },
  { code: "NZ", name: "New Zealand", currency: "NZD", timezone: "Pacific/Auckland", center: [-36.85, 174.76] },
  { code: "BR", name: "Brazil", currency: "BRL", timezone: "America/Sao_Paulo", center: [-23.55, -46.63] },
  { code: "MX", name: "Mexico", currency: "MXN", timezone: "America/Mexico_City", center: [19.43, -99.13] },
];

export function findCountry(code: string) {
  return countries.find((c) => c.code === code);
}
