import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell variant="member" aside={{ text: "Remembered it?", href: "/login", label: "Sign in" }}>
      <AuthHeading eyebrow="Account recovery" title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one." />
      <ForgotPasswordForm portal="app" />
    </AuthShell>
  );
}
