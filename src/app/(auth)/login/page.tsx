import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { SignInForm } from "@/components/auth/SignInForm";
import { auth, enabledSignInMethods } from "@/lib/auth";
import { safeRedirect } from "@/actions/utils";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const next = safeRedirect(params.next ?? params.callbackUrl, "/app/dashboard");
  const session = await auth();
  if (session?.user) redirect(next);

  return (
    <AuthShell variant="member" aside={{ text: "New to Fit Planet?", href: `/register?next=${encodeURIComponent(next)}`, label: "Create an account" }}>
      <AuthHeading eyebrow="Welcome back" title="Sign in to your passport" subtitle="Your passes, stamps and bookings, on every device." />
      <SignInForm methods={enabledSignInMethods()} next={next} errorCode={params.error} forgotHref="/forgot-password" />
    </AuthShell>
  );
}
