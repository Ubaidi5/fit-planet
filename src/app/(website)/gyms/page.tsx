import type { Metadata } from "next";
import { GymsExplorer } from "@/components/gyms/GymsExplorer";
import { listPublishedGyms } from "@/server/modules/gyms";

export const dynamic = "force-dynamic";

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
  const gyms = await listPublishedGyms();

  return (
    <GymsExplorer
      key={`${initialCity}|${initialQuery}`}
      gyms={gyms}
      initialQuery={initialQuery}
      initialCity={initialCity}
    />
  );
}
