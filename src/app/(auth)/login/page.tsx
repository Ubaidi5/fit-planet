import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { SignInForm } from "@/components/auth/SignInForm";
import { enabledSignInMethods } from "@/lib/auth";
import { getSessionUser } from "@/server/session";
import { safeRedirect } from "@/actions/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login");
  return { title: t("meta") };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const t = await getTranslations("auth.login");
  const params = await searchParams;
  const next = safeRedirect(params.next ?? params.callbackUrl, "/app/dashboard");
  const signedIn = await getSessionUser();
  if (signedIn) redirect(next);

  return (
    <AuthShell variant="member" aside={{ text: t("asideText"), href: `/register?next=${encodeURIComponent(next)}`, label: t("asideLink") }}>
      <AuthHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <SignInForm methods={enabledSignInMethods()} next={next} errorCode={params.error} forgotHref="/forgot-password" />
    </AuthShell>
  );
}
