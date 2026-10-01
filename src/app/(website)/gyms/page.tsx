import type { Metadata } from "next";
import { GymsExplorer } from "@/components/gyms/GymsExplorer";

export const metadata: Metadata = {
  title: "Find gyms",
  description:
    "Find partner gyms in any city. Compare passes in local currency and live capacity, then book in seconds.",
};

export default async function GymsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; city?: string | string[] }>;
}) {
  const { q, city } = await searchParams;
  const first = (value?: string | string[]) => (Array.isArray(value) ? (value[0] ?? "") : (value ?? ""));
  const initialQuery = first(q);
  const initialCity = first(city);

  return (
    <GymsExplorer
      key={`${initialCity}|${initialQuery}`}
      initialQuery={initialQuery}
      initialCity={initialCity}
    />
  );
}
