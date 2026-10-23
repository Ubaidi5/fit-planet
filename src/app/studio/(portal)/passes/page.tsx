import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { ownerStats } from "@/server/modules/analytics";
import { PageHeader } from "@/components/studio/PageHeader";
import { PricingEditor } from "@/components/studio/PricingEditor";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("passes") };
}

export default async function StudioPassesPage() {
  const { gym } = await requireOwner("/studio/passes");
  const stats = await ownerStats([gym]);
  const t = await getTranslations("studio.pages");
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={gym.name} title={t("passes")} description={t("passesHint", { currency: gym.currency })} />
      <PricingEditor
        gymId={gym._id.toHexString()}
        currency={gym.currency}
        initial={{
          dayPass: gym.pricing.dayPass,
          weekPass: gym.pricing.weekPass,
          monthPass: gym.pricing.monthPass,
          dailyDayPassLimit: gym.capacity.dailyDayPassLimit ?? null,
        }}
        sales={stats.passMix}
      />
    </div>
  );
}
