// City metadata for the passport UI. Codes follow airport-style city codes.

export interface CityMeta {
  name: string;
  code: string;
  country: string;
  timezone: string;
}

export const cityMeta: Record<string, CityMeta> = {
  Karachi: { name: "Karachi", code: "KHI", country: "PK", timezone: "Asia/Karachi" },
  Tokyo: { name: "Tokyo", code: "TYO", country: "JP", timezone: "Asia/Tokyo" },
  Berlin: { name: "Berlin", code: "BER", country: "DE", timezone: "Europe/Berlin" },
  Dubai: { name: "Dubai", code: "DXB", country: "AE", timezone: "Asia/Dubai" },
  "New York": { name: "New York", code: "NYC", country: "US", timezone: "America/New_York" },
  Lisbon: { name: "Lisbon", code: "LIS", country: "PT", timezone: "Europe/Lisbon" },
  London: { name: "London", code: "LON", country: "GB", timezone: "Europe/London" },
};

export function cityCode(city: string) {
  return cityMeta[city]?.code ?? city.slice(0, 3).toUpperCase();
}
