import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("studio.meta");
  return {
    title: { default: "Studio", template: "%s · Fit Planet Studio" },
    description: t("description"),
  };
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
