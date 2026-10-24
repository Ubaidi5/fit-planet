import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_UPDATED, termsSections } from "@/lib/legal/content";
import { env } from "@/server/env";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("legal"))("terms") };
}

export default async function TermsPage() {
  const t = await getTranslations("legal");
  return (
    <LegalPage title={t("terms")} updated={LEGAL_UPDATED} intro={t("termsIntro")} sections={termsSections(env.legal, Math.round(env.platformFee * 1000) / 10)} />
  );
}
