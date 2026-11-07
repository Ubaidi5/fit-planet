import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding, cityLandingCopy } from "@/components/seo/CityLanding";
import { cityPath, MIN_INDEXABLE_GYMS } from "@/lib/seo";
import { cityLanding } from "@/server/modules/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ city: string; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category } = await params;
  const data = await cityLanding(decodeURIComponent(city), category);
  if (!data) return {};
  const { title, description } = await cityLandingCopy(data);
  const url = cityPath(data.city, category);
  const image = data.gyms[0]?.coverImage;
  return {
    title,
    description,
    alternates: { canonical: url },
    // A single gym makes a thin page: useful to visitors, not worth a search result
    robots: data.gyms.length < MIN_INDEXABLE_GYMS ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", title, description, url, ...(image ? { images: [{ url: image, alt: title }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function CityCategoryPage({ params }: Props) {
  const { city, category } = await params;
  const data = await cityLanding(decodeURIComponent(city), category);
  if (!data) notFound();
  return <CityLanding data={data} />;
}
