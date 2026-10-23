import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { enabledSignInMethods } from "@/lib/auth";
import { getSessionUser } from "@/server/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.studioRegister");
  return { title: t("meta") };
}

export default async function StudioRegisterPage() {
  const t = await getTranslations("auth.studioRegister");
  const signedIn = await getSessionUser();
  if (signedIn) redirect("/studio/onboarding");

  return (
    <AuthShell variant="studio" aside={{ text: t("asideText"), href: "/studio/login", label: t("asideLink") }}>
      <AuthHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <RegisterForm methods={enabledSignInMethods()} next="/studio/onboarding" cta={t("cta")} />
    </AuthShell>
  );
}
