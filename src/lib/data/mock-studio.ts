// Mock data for the gym owner studio. Replace with DB aggregates later.

export const studioGym = {
  name: "FitZone Karachi",
  owner: "Kamran",
  area: "Clifton",
};

export const studioDashboardStats = [
  {
    key: "checkins",
    label: "Today's check-ins",
    value: "47",
    delta: "+12%",
    deltaLabel: "vs yesterday",
    trend: "up" as const,
    spark: [22, 30, 26, 34, 31, 40, 47],
  },
  {
    key: "passes",
    label: "Active passes",
    value: "128",
    delta: "85 monthly",
    deltaLabel: "43 daily",
    trend: "flat" as const,
    spark: [110, 114, 117, 119, 122, 125, 128],
  },
  {
    key: "revenue",
    label: "Today's revenue",
    value: "Rs. 24,500",
    delta: "+8%",
    deltaLabel: "vs yesterday",
    trend: "up" as const,
    spark: [14, 18, 16, 21, 19, 22, 24.5],
  },
  {
    key: "capacity",
    label: "In the gym now",
    value: "42/100",
    delta: "42%",
    deltaLabel: "utilization",
    trend: "flat" as const,
    spark: [12, 28, 45, 38, 30, 36, 42],
  },
];
