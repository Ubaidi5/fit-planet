import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { imprintSections, LEGAL_UPDATED } from "@/lib/legal/content";
import { env } from "@/server/env";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("legal"))("imprint") };
}

export default async function ImprintPage() {
  const t = await getTranslations("legal");
  return <LegalPage title={t("imprint")} updated={LEGAL_UPDATED} sections={imprintSections(env.legal)} />;
}
