import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth, enabledSignInMethods } from "@/lib/auth";

export const metadata: Metadata = { title: "List your gym" };

export default async function StudioRegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/studio/onboarding");

  return (
    <AuthShell variant="studio" aside={{ text: "Already listed?", href: "/studio/login", label: "Sign in" }}>
      <AuthHeading
        eyebrow="List your gym · Free"
        title="Put your gym on the map"
        subtitle="Create your account, then add your gym in about five minutes. Members can book as soon as you publish."
      />
      <RegisterForm methods={enabledSignInMethods()} next="/studio/onboarding" cta="Create account and continue" />
    </AuthShell>
  );
}
