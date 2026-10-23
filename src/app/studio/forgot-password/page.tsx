import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.studioForgot");
  return { title: t("meta") };
}

export default async function StudioForgotPasswordPage() {
  const t = await getTranslations("auth.studioForgot");
  return (
    <AuthShell variant="studio" aside={{ text: t("asideText"), href: "/studio/login", label: t("asideLink") }}>
      <AuthHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ForgotPasswordForm portal="studio" />
    </AuthShell>
  );
}
