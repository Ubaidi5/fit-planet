import "server-only";
import type { GymDoc } from "@/server/db/models";
import type { GymFormValues } from "@/components/studio/gym-form-values";

/** Maps a stored gym into the editor's form values */
export function gymToFormValues(gym: GymDoc): GymFormValues {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return {
    name: gym.name,
    description: gym.description,
    longDescription: gym.longDescription ?? "",
    street: gym.address.street,
    area: gym.address.area,
    city: gym.address.city,
    country: gym.country,
    currency: gym.currency,
    timezone: gym.timezone,
    lat: gym.location.coordinates[1],
    lng: gym.location.coordinates[0],
    dayPass: gym.pricing.dayPass,
    weekPass: gym.pricing.weekPass,
    monthPass: gym.pricing.monthPass,
    capacity: gym.capacity.max,
    dailyDayPassLimit: gym.capacity.dailyDayPassLimit ?? "",
    is24Hours: gym.hours.is24Hours,
    open: gym.hours.open,
    close: gym.hours.close,
    operatingHours:
      gym.operatingHours?.length === 7
        ? gym.operatingHours
        : days.map((day) => ({ day, open: gym.hours.open, close: gym.hours.close === "24:00" ? "23:59" : gym.hours.close, isClosed: false })),
    amenities: gym.amenities,
    equipmentTypes: gym.equipmentTypes,
    images: gym.images,
    coverImage: gym.coverImage,
    phone: gym.contact?.phone ?? "",
    email: gym.contact?.email ?? "",
    website: gym.contact?.website ?? "",
    instagram: gym.contact?.instagram ?? "",
    facebook: gym.contact?.facebook ?? "",
    cancellation: gym.policies?.cancellation ?? "",
    guestPolicy: gym.policies?.guestPolicy ?? "",
    dresscode: gym.policies?.dresscode ?? "",
    ageRestriction: gym.policies?.ageRestriction ?? "",
  };
}
