import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { token, portal } = await searchParams;
  const variant = portal === "studio" ? "studio" : "member";
  return (
    <AuthShell variant={variant}>
      <AuthHeading eyebrow="Account recovery" title="Choose a new password" />
      {token ? (
        <ResetPasswordForm token={token} portal={portal} />
      ) : (
        <p className="text-[15px] text-gray-600">
          This link is missing its token.{" "}
          <Link href="/forgot-password" className="font-semibold text-ink underline-offset-4 hover:underline">
            Ask for a new link
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
