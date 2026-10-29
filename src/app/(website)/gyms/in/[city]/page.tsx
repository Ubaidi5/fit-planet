import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding, cityLandingCopy } from "@/components/seo/CityLanding";
import { cityPath } from "@/lib/seo";
import { cityLanding } from "@/server/modules/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = await cityLanding(decodeURIComponent(city));
  if (!data) return {};
  const { title, description } = await cityLandingCopy(data);
  const url = cityPath(data.city);
  const image = data.gyms[0]?.coverImage;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, ...(image ? { images: [{ url: image, alt: title }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const data = await cityLanding(decodeURIComponent(city));
  if (!data) notFound();
  return <CityLanding data={data} />;
}
