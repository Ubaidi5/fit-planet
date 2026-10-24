import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { enabledSignInMethods } from "@/lib/auth";
import { getSessionUser } from "@/server/session";
import { safeRedirect } from "@/actions/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.studioRegister");
  return { title: t("meta") };
}

export default async function StudioRegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const t = await getTranslations("auth.studioRegister");
  // A staff invite sends new people back to its join page after sign-up
  const next = safeRedirect((await searchParams).next, "/studio/onboarding");
  const signedIn = await getSessionUser();
  if (signedIn) redirect(next);

  return (
    <AuthShell variant="studio" aside={{ text: t("asideText"), href: "/studio/login", label: t("asideLink") }}>
      <AuthHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <RegisterForm methods={enabledSignInMethods()} next={next} cta={t("cta")} />
    </AuthShell>
  );
}
