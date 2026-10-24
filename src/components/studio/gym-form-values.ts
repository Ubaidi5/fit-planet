// Form shape for the gym editor. Kept out of the client component so server
// pages can build initial values.
import type { GymInput } from "@/actions/studio";
import { countries, findCountry } from "@/lib/data/countries";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export type GymFormValues = Omit<GymInput, "operatingHours"> & {
  operatingHours: { day: string; open: string; close: string; isClosed: boolean }[];
};

export const AMENITIES = ["Parking", "Showers", "Lockers", "AC", "WiFi", "Sauna", "Steam room", "Pool", "Towels", "Cafe", "Women-only area", "Personal training", "Group classes", "Kids area", "Wheelchair access"];
export const EQUIPMENT = ["Cardio", "Strength", "Free Weights", "Functional", "Powerlifting", "CrossFit", "Yoga", "Pilates", "Boxing", "Martial Arts", "Spin", "Swimming"];

export function emptyGymValues(defaults: Partial<GymFormValues> = {}): GymFormValues {
  const country = findCountry(defaults.country ?? "PK") ?? countries[0];
  return {
    name: "",
    description: "",
    longDescription: "",
    street: "",
    area: "",
    city: "",
    country: country.code,
    currency: country.currency,
    timezone: country.timezone,
    lat: country.center[0],
    lng: country.center[1],
    dayPass: "",
    weekPass: "",
    monthPass: "",
    capacity: 50,
    dailyDayPassLimit: "",
    is24Hours: false,
    open: "06:00",
    close: "23:00",
    operatingHours: DAYS.map((day) => ({ day, open: "06:00", close: "23:00", isClosed: false })),
    amenities: [],
    equipmentTypes: [],
    images: [],
    coverImage: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
    cancellation: "",
    guestPolicy: "",
    dresscode: "",
    ageRestriction: "",
    ...defaults,
  } as GymFormValues;
}

