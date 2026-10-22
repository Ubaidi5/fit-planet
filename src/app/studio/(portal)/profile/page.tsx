import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { gymToFormValues } from "@/server/modules/gym-form";
import { PageHeader } from "@/components/studio/PageHeader";
import { GymEditor } from "@/components/studio/GymEditor";
import { PublishCard } from "@/components/studio/PublishCard";
import { FormAlert } from "@/components/auth/FormBits";

export const metadata: Metadata = { title: "Gym profile" };

export default async function StudioProfilePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { gym, user } = await requireOwner("/studio/profile");
  const { welcome } = await searchParams;
  const isOwner = gym.ownerId.equals(user._id);
  const checklist = [
    { label: "Name and description", done: gym.name.length > 1 && gym.description.length >= 20 },
    { label: "At least one photo", done: gym.images.length > 0 },
    { label: "Day pass price", done: gym.pricing.dayPass > 0 },
    { label: "Address", done: Boolean(gym.address.street && gym.address.city) },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow="Your listing" title="Gym profile" description="Everything members see on your page." />
      {welcome && (
        <FormAlert tone="success" className="mb-5">
          Welcome to Fit Planet Studio. Add a few photos, then publish to start taking bookings.
        </FormAlert>
      )}
      <div className="space-y-5">
        <PublishCard gymId={gym._id.toHexString()} slug={gym.slug} status={gym.status} checklist={checklist} />
        {isOwner ? (
          <GymEditor mode="edit" gymId={gym._id.toHexString()} initial={gymToFormValues(gym)} />
        ) : (
          <p className="rounded-3xl bg-surface p-6 text-sm text-gray-600 shadow-soft">Only the gym owner can edit the listing.</p>
        )}
      </div>
    </div>
  );
}
