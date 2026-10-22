import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { SignInForm } from "@/components/auth/SignInForm";
import { auth, enabledSignInMethods } from "@/lib/auth";
import { safeRedirect } from "@/actions/utils";

export const metadata: Metadata = { title: "Studio sign in" };

export default async function StudioLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const next = safeRedirect(params.next, "/studio/dashboard");
  const session = await auth();
  if (session?.user) redirect(next);

  return (
    <AuthShell variant="studio" aside={{ text: "New gym?", href: "/studio/register", label: "List your gym" }}>
      <AuthHeading eyebrow="Fit Planet Studio" title="Sign in to your studio" subtitle="Bookings, check-ins and revenue for your gym." />
      <SignInForm methods={enabledSignInMethods()} next={next} errorCode={params.error} forgotHref="/studio/forgot-password" />
    </AuthShell>
  );
}
