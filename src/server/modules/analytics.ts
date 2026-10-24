import "server-only";
import type { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { GymDoc } from "@/server/db/models";
import { addDays, todayIn } from "@/lib/dates";
import type { PassType } from "@/lib/passes";
import { occupancyFor } from "./gyms";

export interface DailyPoint {
  date: string;
  revenue: number;
  bookings: number;
}

export interface OwnerStats {
  currency: string;
  today: string;
  occupancy: { current: number; max: number };
  todayBookings: number;
  todayRevenue: number;
  todayCheckins: number;
  activePasses: number;
  upcomingPasses: number;
  unpaidAtDesk: number;
  revenue30: number;
  revenuePrev30: number;
  bookings30: number;
  series: DailyPoint[];
  passMix: Record<PassType, { count: number; revenue: number }>;
  /** Average check-ins per hour of day over the last 30 days, 0..23 */
  hourly: number[];
}

/**
 * Dashboard numbers for everything an owner manages. Dates are computed in
 * the first gym's timezone; revenue counts bookings in that gym's currency.
 */
export async function ownerStats(gyms: GymDoc[]): Promise<OwnerStats> {
  const primary = gyms[0];
  const gymIds: ObjectId[] = gyms.map((g) => g._id);
  const tz = primary.timezone;
  const today = todayIn(tz);
  const from30 = addDays(today, -29);
  const from60 = addDays(today, -59);

  const bookings = await collections.bookings();
  const checkins = await collections.checkins();

  const [recent, occupancy, checkinRows] = await Promise.all([
    bookings
      .find({ gymId: { $in: gymIds }, status: { $in: ["confirmed", "refunded"] }, createdAt: { $gte: new Date(`${from60}T00:00:00Z`) } })
      .project<{ amount: number; currency: string; passType: PassType; createdAt: Date; status: string; paymentStatus: string }>({
        amount: 1,
        currency: 1,
        passType: 1,
        createdAt: 1,
        status: 1,
        paymentStatus: 1,
      })
      .toArray(),
    occupancyFor(gymIds),
    checkins
      .find({ gymId: { $in: gymIds }, at: { $gte: new Date(Date.now() - 30 * 86_400_000) } })
      .project<{ at: Date }>({ at: 1 })
      .toArray(),
  ]);

  const series = new Map<string, DailyPoint>();
  for (let i = 0; i < 30; i++) {
    const date = addDays(from30, i);
    series.set(date, { date, revenue: 0, bookings: 0 });
  }
  const passMix: OwnerStats["passMix"] = { day: { count: 0, revenue: 0 }, week: { count: 0, revenue: 0 }, month: { count: 0, revenue: 0 } };
  let revenue30 = 0;
  let revenuePrev30 = 0;
  let bookings30 = 0;
  let todayBookings = 0;
  let todayRevenue = 0;

  for (const b of recent) {
    const date = todayIn(tz, b.createdAt);
    const counts = b.status === "confirmed" && b.currency === primary.currency;
    const amount = counts ? b.amount : 0;
    if (date >= from30) {
      bookings30++;
      revenue30 += amount;
      passMix[b.passType].count++;
      passMix[b.passType].revenue += amount;
      const point = series.get(date);
      if (point) {
        point.bookings++;
        point.revenue += amount;
      }
      if (date === today) {
        todayBookings++;
        todayRevenue += amount;
      }
    } else {
      revenuePrev30 += amount;
    }
  }

  const hourCounts = new Array(24).fill(0);
  let todayCheckins = 0;
  const hourFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: tz });
  for (const c of checkinRows) {
    hourCounts[Number(hourFormat.format(c.at)) % 24]++;
    if (todayIn(tz, c.at) === today) todayCheckins++;
  }

  const [activePasses, upcomingPasses, unpaidAtDesk] = await Promise.all([
    bookings.countDocuments({ gymId: { $in: gymIds }, status: "confirmed", startDate: { $lte: today }, endDate: { $gte: today } }),
    bookings.countDocuments({ gymId: { $in: gymIds }, status: "confirmed", startDate: { $gt: today } }),
    bookings.countDocuments({ gymId: { $in: gymIds }, status: "confirmed", paymentMethod: "desk", paymentStatus: "unpaid", endDate: { $gte: today } }),
  ]);

  return {
    currency: primary.currency,
    today,
    occupancy: {
      current: gymIds.reduce((sum, id) => sum + (occupancy.get(id.toHexString()) ?? 0), 0),
      max: gyms.reduce((sum, g) => sum + g.capacity.max, 0),
    },
    todayBookings,
    todayRevenue,
    todayCheckins,
    activePasses,
    upcomingPasses,
    unpaidAtDesk,
    revenue30,
    revenuePrev30,
    bookings30,
    series: [...series.values()],
    passMix,
    hourly: hourCounts.map((count) => Math.round((count / 30) * 10) / 10),
  };
}
