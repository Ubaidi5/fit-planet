import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = { title: "Reset your studio password" };

export default function StudioForgotPasswordPage() {
  return (
    <AuthShell variant="studio" aside={{ text: "Remembered it?", href: "/studio/login", label: "Sign in" }}>
      <AuthHeading eyebrow="Account recovery" title="Forgot your password?" subtitle="Enter the email you use for your studio and we'll send a reset link." />
      <ForgotPasswordForm portal="studio" />
    </AuthShell>
  );
}
