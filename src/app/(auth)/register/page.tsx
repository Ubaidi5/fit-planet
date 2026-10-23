import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth, enabledSignInMethods } from "@/lib/auth";
import { safeRedirect } from "@/actions/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.register");
  return { title: t("meta") };
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const t = await getTranslations("auth.register");
  const params = await searchParams;
  const next = safeRedirect(params.next, "/app/dashboard");
  const session = await auth();
  if (session?.user) redirect(next);

  return (
    <AuthShell variant="member" aside={{ text: t("asideText"), href: `/login?next=${encodeURIComponent(next)}`, label: t("asideLink") }}>
      <AuthHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <RegisterForm methods={enabledSignInMethods()} next={next} />
    </AuthShell>
  );
}
