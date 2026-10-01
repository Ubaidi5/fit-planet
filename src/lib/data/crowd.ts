// Mock hourly crowd forecast. Real check-in history will replace this once
// the database exists; the shape (24 values, 0 to 100) should stay the same.

import type { Gym } from "./mock-gyms";

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

/** Typical weekday: morning bump, lunch dip, big evening peak */
const baseCurve = [
  4, 2, 1, 1, 2, 10, 32, 52, 46, 30, 24, 28, 36, 30, 24, 28, 44, 70, 88, 80, 58, 36, 20, 10,
];

/** Expected crowd (percent of capacity) for each hour 0 to 23 */
export function crowdForecast(gym: Pick<Gym, "slug" | "hours">) {
  const random = seeded(gym.slug);
  const open = gym.hours.is24Hours ? 0 : Number(gym.hours.open.split(":")[0]);
  const closeRaw = gym.hours.is24Hours ? 24 : Number(gym.hours.close.split(":")[0]);
  const close = closeRaw === 0 ? 24 : closeRaw;
  return baseCurve.map((value, hour) => {
    const isOpen = gym.hours.is24Hours || (hour >= open && hour < close);
    if (!isOpen) return 0;
    const jitter = (random() - 0.5) * 18;
    return Math.max(4, Math.min(98, Math.round(value + jitter)));
  });
}

/** The quietest open hours after `fromHour`, best first */
export function quietestHours(forecast: number[], fromHour: number, count = 2) {
  return forecast
    .map((value, hour) => ({ hour, value }))
    .filter(({ hour, value }) => hour >= fromHour && value > 0)
    .sort((a, b) => a.value - b.value)
    .slice(0, count)
    .sort((a, b) => a.hour - b.hour);
}
