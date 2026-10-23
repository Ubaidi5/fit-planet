import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.reset");
  return { title: t("title") };
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const t = await getTranslations("auth.reset");
  const { token, portal } = await searchParams;
  const variant = portal === "studio" ? "studio" : "member";
  return (
    <AuthShell variant={variant}>
      <AuthHeading eyebrow={t("eyebrow")} title={t("title")} />
      {token ? (
        <ResetPasswordForm token={token} portal={portal} />
      ) : (
        <p className="text-[15px] text-gray-600">
          {t("missing")}{" "}
          <Link href="/forgot-password" className="font-semibold text-ink underline-offset-4 hover:underline">
            {t("askNew")}
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
