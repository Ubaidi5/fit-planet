import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GymProfileView, type TabType } from "@/components/gyms/GymProfileView";
import { ReviewForm } from "@/components/gyms/ReviewForm";
import { SaveGymButton } from "@/components/gyms/SaveGymButton";
import { getPublicGymProfile } from "@/server/modules/gyms";
import { getSessionUser } from "@/server/session";
import { collections, toObjectId } from "@/server/db/collections";
import { env } from "@/server/env";
import type { Gym } from "@/lib/types";
import { breadcrumbJsonLd } from "@/components/seo/Breadcrumbs";
import { cityPath, jsonLd } from "@/lib/seo";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPublicGymProfile(id);
  if (!profile) return { title: (await getTranslations("gym"))("notFound") };
  const { gym } = profile;
  const title = `${gym.name}, ${gym.address.city}`;
  return {
    title,
    description: gym.description,
    alternates: { canonical: `/gyms/${gym.slug}` },
    openGraph: { type: "website", title, description: gym.description, url: `/gyms/${gym.slug}`, images: [{ url: gym.coverImage, alt: gym.name }] },
    twitter: { card: "summary_large_image", title, description: gym.description, images: [gym.coverImage] },
  };
}

const TABS: TabType[] = ["overview", "passes", "classes", "trainers", "reviews"];

export default async function GymPage({ params, searchParams }: Props) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const profile = await getPublicGymProfile(id);
  if (!profile) notFound();

  const user = await getSessionUser();
  const [t, tc] = await Promise.all([getTranslations("gym"), getTranslations("cityPages")]);
  let reviewSlot: React.ReactNode = (
    <div className="flex flex-col items-start justify-between gap-4 rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 p-6 sm:flex-row sm:items-center">
      <div>
        <h3 className="font-semibold text-ink">{t("trainedHere")}</h3>
        <p className="mt-0.5 text-sm text-gray-500">{t("verifiedReviewHint")}</p>
      </div>
      <Link
        href={user ? `/gyms/${profile.gym.slug}/book` : `/login?next=${encodeURIComponent(`/gyms/${profile.gym.slug}?tab=reviews`)}`}
        className="inline-flex h-11 shrink-0 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        {user ? t("bookPass") : t("signInReview")}
      </Link>
    </div>
  );

  if (user && profile.ownerId !== user._id.toHexString()) {
    const booked = await (await collections.bookings()).findOne(
      { userId: user._id, gymId: toObjectId(profile.gym.id)!, status: "confirmed" },
      { projection: { _id: 1 } },
    );
    if (booked) reviewSlot = <ReviewForm gymId={profile.gym.id} gymName={profile.gym.name} />;
  }
  if (user && profile.ownerId === user._id.toHexString()) reviewSlot = null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: gymJsonLd(profile.gym) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbJsonLd([
              { label: tc("home"), href: "/" },
              { label: tc("cities"), href: "/gyms/in" },
              { label: profile.gym.address.city, href: cityPath(profile.gym.address.city) },
              { label: profile.gym.name, href: `/gyms/${profile.gym.slug}` },
            ]),
          ),
        }}
      />
      <GymProfileView
      gym={profile.gym}
      details={profile.details}
      initialTab={TABS.includes(tab as TabType) ? (tab as TabType) : "overview"}
      reviewSlot={reviewSlot}
      headerActions={
        <SaveGymButton gymId={profile.gym.id} signedIn={Boolean(user)} saved={Boolean(user?.savedGymIds?.some((g) => g.toHexString() === profile.gym.id))} />
      }
      />
    </>
  );
}

/** Structured data so search engines can show the gym's rating, address and prices */
function gymJsonLd(gym: Gym) {
  const url = `${env.appUrl}/gyms/${gym.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "@id": url,
    url,
    name: gym.name,
    description: gym.description,
    image: [...new Set([gym.coverImage, ...gym.images].filter(Boolean))].slice(0, 5),
    address: { "@type": "PostalAddress", streetAddress: gym.address.street, addressLocality: gym.address.city, addressRegion: gym.address.area, addressCountry: gym.country },
    geo: { "@type": "GeoCoordinates", latitude: gym.location.lat, longitude: gym.location.lng },
    currenciesAccepted: gym.currency,
    openingHoursSpecification: gym.hours.is24Hours
      ? { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" }
      : { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: gym.hours.open, closes: gym.hours.close },
    makesOffer: (["dayPass", "weekPass", "monthPass"] as const)
      .filter((key) => gym.pricing[key] > 0)
      .map((key) => ({ "@type": "Offer", name: { dayPass: "Day pass", weekPass: "Week pass", monthPass: "Month pass" }[key], price: gym.pricing[key], priceCurrency: gym.currency, url })),
    ...(gym.totalReviews > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: gym.rating, reviewCount: gym.totalReviews, bestRating: 5 } } : {}),
  };
  return jsonLd(data);
}
