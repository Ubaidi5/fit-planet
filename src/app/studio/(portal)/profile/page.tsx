import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { gymToFormValues } from "@/server/modules/gym-form";
import { PageHeader } from "@/components/studio/PageHeader";
import { GymEditor } from "@/components/studio/GymEditor";
import { PublishCard } from "@/components/studio/PublishCard";
import { FormAlert } from "@/components/auth/FormBits";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("profile") };
}

export default async function StudioProfilePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const { gym, user } = await requireOwner("/studio/profile", { ownerOnly: true });
  const { welcome } = await searchParams;
  const isOwner = gym.ownerId.equals(user._id);
  const t = await getTranslations("studio.pages");
  const checklist = [
    { label: t("check.name"), done: gym.name.length > 1 && gym.description.length >= 20 },
    { label: t("check.photo"), done: gym.images.length > 0 },
    { label: t("check.price"), done: gym.pricing.dayPass > 0 },
    { label: t("check.address"), done: Boolean(gym.address.street && gym.address.city) },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={t("yourListing")} title={t("profile")} description={t("profileHint")} />
      {welcome && (
        <FormAlert tone="success" className="mb-5">
          {t("welcome")}
        </FormAlert>
      )}
      <div className="space-y-5">
        <PublishCard gymId={gym._id.toHexString()} slug={gym.slug} status={gym.status} checklist={checklist} />
        {isOwner ? (
          <GymEditor mode="edit" gymId={gym._id.toHexString()} initial={gymToFormValues(gym)} />
        ) : (
          <p className="rounded-3xl bg-surface p-6 text-sm text-gray-600 shadow-soft">{t("ownerOnly")}</p>
        )}
      </div>
    </div>
  );
}
