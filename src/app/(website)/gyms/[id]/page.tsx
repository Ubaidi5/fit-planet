import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GymProfileView, type TabType } from "@/components/gyms/GymProfileView";
import { ReviewForm } from "@/components/gyms/ReviewForm";
import { getPublicGymProfile } from "@/server/modules/gyms";
import { getSessionUser } from "@/server/session";
import { collections, toObjectId } from "@/server/db/collections";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPublicGymProfile(id);
  if (!profile) return { title: "Gym not found" };
  const { gym } = profile;
  return {
    title: `${gym.name}, ${gym.address.city}`,
    description: gym.description,
    openGraph: { images: [gym.coverImage] },
  };
}

const TABS: TabType[] = ["overview", "passes", "classes", "trainers", "reviews"];

export default async function GymPage({ params, searchParams }: Props) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const profile = await getPublicGymProfile(id);
  if (!profile) notFound();

  const user = await getSessionUser();
  let reviewSlot: React.ReactNode = (
    <div className="flex flex-col items-start justify-between gap-4 rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 p-6 sm:flex-row sm:items-center">
      <div>
        <h3 className="font-semibold text-ink">Trained here?</h3>
        <p className="mt-0.5 text-sm text-gray-500">Members who book through Fit Planet can leave a verified review.</p>
      </div>
      <Link
        href={user ? `/gyms/${profile.gym.slug}/book` : `/login?next=${encodeURIComponent(`/gyms/${profile.gym.slug}?tab=reviews`)}`}
        className="inline-flex h-11 shrink-0 items-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        {user ? "Book a pass" : "Sign in to review"}
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
    <GymProfileView
      gym={profile.gym}
      details={profile.details}
      initialTab={TABS.includes(tab as TabType) ? (tab as TabType) : "overview"}
      reviewSlot={reviewSlot}
    />
  );
}
