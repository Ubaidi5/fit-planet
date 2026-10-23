import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { SignInForm } from "@/components/auth/SignInForm";
import { auth, enabledSignInMethods } from "@/lib/auth";
import { safeRedirect } from "@/actions/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.studioLogin");
  return { title: t("meta") };
}

export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const t = await getTranslations("auth.studioLogin");
  const params = await searchParams;
  const next = safeRedirect(params.next, "/studio/dashboard");
  const session = await auth();
  if (session?.user) redirect(next);

  return (
    <AuthShell variant="studio" aside={{ text: t("asideText"), href: "/studio/register", label: t("asideLink") }}>
      <AuthHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <SignInForm methods={enabledSignInMethods()} next={next} errorCode={params.error} forgotHref="/studio/forgot-password" />
    </AuthShell>
  );
}
