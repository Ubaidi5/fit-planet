import type { Metadata } from "next";
import { GymsExplorer } from "@/components/gyms/GymsExplorer";

export const metadata: Metadata = {
  title: "Find gyms",
  description:
    "Compare gyms near you by price, amenities and live capacity, then book a day pass or membership in seconds.",
};

export default async function GymsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  return <GymsExplorer key={initialQuery} initialQuery={initialQuery} />;
}
