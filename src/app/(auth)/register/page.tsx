import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth, enabledSignInMethods } from "@/lib/auth";
import { safeRedirect } from "@/actions/utils";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const next = safeRedirect(params.next, "/app/dashboard");
  const session = await auth();
  if (session?.user) redirect(next);

  return (
    <AuthShell variant="member" aside={{ text: "Already a member?", href: `/login?next=${encodeURIComponent(next)}`, label: "Sign in" }}>
      <AuthHeading eyebrow="Get your passport" title="Create your Fit Planet account" subtitle="Book day passes at gyms in any city and walk in with a QR code." />
      <RegisterForm methods={enabledSignInMethods()} next={next} />
    </AuthShell>
  );
}
