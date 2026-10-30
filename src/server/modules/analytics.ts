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
  const scope = { gymId: { $in: gymIds } };
  const day = (field: string) => ({ $dateToString: { format: "%Y-%m-%d", date: field, timezone: tz } });

  // Totals are added up inside MongoDB, so only a few dozen rows come back
  // however many bookings and check-ins a gym has
  const [[bookingFacets], [checkinFacets], occupancy, activePasses, upcomingPasses, unpaidAtDesk] = await Promise.all([
    bookings
      .aggregate<{
        byDay: { _id: string; bookings: number; revenue: number }[];
        byPass: { _id: PassType; count: number; revenue: number }[];
        previous: { revenue: number }[];
      }>([
        { $match: { ...scope, status: { $in: ["confirmed", "refunded"] }, createdAt: { $gte: new Date(`${from60}T00:00:00Z`) } } },
        {
          $project: {
            day: day("$createdAt"),
            passType: 1,
            // Refunds count as bookings but not revenue; other currencies can't be summed
            amount: { $cond: [{ $and: [{ $eq: ["$status", "confirmed"] }, { $eq: ["$currency", primary.currency] }] }, "$amount", 0] },
          },
        },
        {
          $facet: {
            byDay: [{ $match: { day: { $gte: from30 } } }, { $group: { _id: "$day", bookings: { $sum: 1 }, revenue: { $sum: "$amount" } } }],
            byPass: [{ $match: { day: { $gte: from30 } } }, { $group: { _id: "$passType", count: { $sum: 1 }, revenue: { $sum: "$amount" } } }],
            previous: [{ $match: { day: { $lt: from30 } } }, { $group: { _id: null, revenue: { $sum: "$amount" } } }],
          },
        },
      ])
      .toArray(),
    checkins
      .aggregate<{ byHour: { _id: number; count: number }[]; today: { count: number }[] }>([
        { $match: { ...scope, at: { $gte: new Date(Date.now() - 30 * 86_400_000) } } },
        {
          $facet: {
            byHour: [{ $group: { _id: { $hour: { date: "$at", timezone: tz } }, count: { $sum: 1 } } }],
            today: [{ $match: { $expr: { $eq: [day("$at"), today] } } }, { $count: "count" }],
          },
        },
      ])
      .toArray(),
    occupancyFor(gymIds),
    bookings.countDocuments({ ...scope, status: "confirmed", startDate: { $lte: today }, endDate: { $gte: today } }),
    bookings.countDocuments({ ...scope, status: "confirmed", startDate: { $gt: today } }),
    bookings.countDocuments({ ...scope, status: "confirmed", paymentMethod: "desk", paymentStatus: "unpaid", endDate: { $gte: today } }),
  ]);

  const series = new Map<string, DailyPoint>();
  for (let i = 0; i < 30; i++) {
    const date = addDays(from30, i);
    series.set(date, { date, revenue: 0, bookings: 0 });
  }
  for (const row of bookingFacets.byDay) {
    const point = series.get(row._id);
    if (point) Object.assign(point, { bookings: row.bookings, revenue: row.revenue });
  }
  const passMix: OwnerStats["passMix"] = { day: { count: 0, revenue: 0 }, week: { count: 0, revenue: 0 }, month: { count: 0, revenue: 0 } };
  for (const row of bookingFacets.byPass) if (passMix[row._id]) passMix[row._id] = { count: row.count, revenue: row.revenue };
  const points = [...series.values()];
  const bookings30 = points.reduce((sum, p) => sum + p.bookings, 0);
  const revenue30 = points.reduce((sum, p) => sum + p.revenue, 0);
  const revenuePrev30 = bookingFacets.previous[0]?.revenue ?? 0;
  const todayPoint = series.get(today);

  const hourCounts = new Array(24).fill(0);
  for (const row of checkinFacets.byHour) hourCounts[row._id % 24] = row.count;
  const todayCheckins = checkinFacets.today[0]?.count ?? 0;

  return {
    currency: primary.currency,
    today,
    occupancy: {
      current: gymIds.reduce((sum, id) => sum + (occupancy.get(id.toHexString()) ?? 0), 0),
      max: gyms.reduce((sum, g) => sum + g.capacity.max, 0),
    },
    todayBookings: todayPoint?.bookings ?? 0,
    todayRevenue: todayPoint?.revenue ?? 0,
    todayCheckins,
    activePasses,
    upcomingPasses,
    unpaidAtDesk,
    revenue30,
    revenuePrev30,
    bookings30,
    series: points,
    passMix,
    hourly: hourCounts.map((count) => Math.round((count / 30) * 10) / 10),
  };
}
