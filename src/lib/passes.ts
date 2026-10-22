// Pass catalogue shared by the UI and the server.

export type PassType = "day" | "week" | "month";

export const PASS_TYPES: PassType[] = ["day", "week", "month"];

export const passMeta: Record<PassType, { label: string; short: string; days: number; pricingKey: "dayPass" | "weekPass" | "monthPass" }> = {
  day: { label: "Day pass", short: "Day", days: 1, pricingKey: "dayPass" },
  week: { label: "Week pass", short: "Week", days: 7, pricingKey: "weekPass" },
  month: { label: "Month pass", short: "Month", days: 30, pricingKey: "monthPass" },
};

export function isPassType(value: unknown): value is PassType {
  return value === "day" || value === "week" || value === "month";
}
