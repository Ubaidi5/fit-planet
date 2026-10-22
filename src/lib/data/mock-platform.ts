// Platform-level mock data for the marketing site.
// Everything here is placeholder content for the UI. It is derived from the
// other mock files where possible so numbers stay consistent, and it will be
// replaced by real aggregates once the database is wired up.

import { mockGyms } from "./mock-gyms";

export const DATA_SOURCE = "mock" as const;

const averageRating =
  mockGyms.reduce((sum, gym) => sum + gym.rating, 0) / mockGyms.length;

const cities = Array.from(new Set(mockGyms.map((gym) => gym.address.city)));

const liveCapacity = mockGyms.reduce(
  (acc, gym) => ({
    current: acc.current + gym.capacity.current,
    max: acc.max + gym.capacity.max,
  }),
  { current: 0, max: 0 },
);

const countries = Array.from(new Set(mockGyms.map((gym) => gym.country)));

export const platformStats = {
  partnerGyms: mockGyms.length,
  countries,
  launchCity: cities[0] ?? "Karachi",
  cities,
  averageRating: Math.round(averageRating * 10) / 10,
  totalReviews: mockGyms.reduce((sum, gym) => sum + gym.totalReviews, 0),
  lowestDayPass: Math.min(...mockGyms.map((gym) => gym.pricing.dayPass)),
  liveCapacity,
  /** Median time from opening the app to a confirmed pass, in seconds */
  bookingTimeSeconds: 45,
};

export const heroStats = [
  { value: String(platformStats.partnerGyms), label: "Partner gyms" },
  { value: String(platformStats.cities.length), label: "Cities on one pass" },
  { value: String(countries.length), label: "Local currencies" },
  { value: `${platformStats.bookingTimeSeconds}s`, label: "From search to pass" },
];

export const launchAreas = Array.from(
  new Set(mockGyms.map((gym) => gym.address.area)),
);

export const testimonials = [
  {
    quote:
      "I split my month between Karachi and Dubai. One pass, prices in dirhams or rupees, and the QR just works at the door. I train more because of it.",
    name: "Hira S.",
    role: "Product designer, Karachi and Dubai",
    initials: "HS",
  },
  {
    quote:
      "We never had a website. Now people find us, book, and walk in with a QR code. The capacity view alone saves my front desk an hour a day.",
    name: "Kamran A.",
    role: "Owner, partner gym in Karachi",
    initials: "KA",
  },
  {
    quote:
      "Landed in Tokyo for a conference, opened the app, saw Iron Shrine was quiet and booked in yen. Got a new stamp in my passport by 7am.",
    name: "Lena M.",
    role: "Consultant, Berlin",
    initials: "LM",
  },
];

export const ownerPreview = {
  gymName: mockGyms[0]?.name ?? "FitZone",
  checkInsToday: 42,
  revenueToday: 45000,
  capacity: mockGyms[0]?.capacity ?? { current: 32, max: 50 },
  weeklyBookings: [38, 52, 44, 68, 61, 79, 88],
  weeklyGrowth: 12,
  recentCheckIns: [
    { name: "Ahmed K.", time: "2 min ago", pass: "Day pass" },
    { name: "Sara M.", time: "5 min ago", pass: "Monthly" },
    { name: "Ali R.", time: "12 min ago", pass: "Week pass" },
  ],
};
