import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_UPDATED, privacySections } from "@/lib/legal/content";
import { env } from "@/server/env";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("legal"))("privacy") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  return <LegalPage title={t("privacy")} updated={LEGAL_UPDATED} intro={t("privacyIntro")} sections={privacySections(env.legal)} />;
}
