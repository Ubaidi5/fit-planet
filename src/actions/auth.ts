"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { registerWithPassword, requestPasswordReset, resetPassword, UserError } from "@/server/modules/users";
import { fieldErrors, safeRedirect } from "./utils";

const passwordRule = z.string().min(8, "Use at least 8 characters").max(128);

const registerSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.email("Enter a valid email"),
  password: passwordRule,
  phone: z.string().trim().max(24).optional(),
  next: z.string().optional(),
});

/** Creates an email + password account and signs straight in */
export async function registerAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };

  try {
    await registerWithPassword(parsed.data);
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message };
    console.error("[auth] register failed", error);
    return { ok: false, error: "We couldn't create your account. Please try again." };
  }

  await signIn("password", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: safeRedirect(parsed.data.next, "/app/dashboard"),
  });
  return { ok: true };
}

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  next: z.string().optional(),
});

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await signIn("password", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeRedirect(parsed.data.next, "/app/dashboard"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: error.type === "CredentialsSignin" ? "That email and password don't match." : "Sign-in failed. Please try again." };
    }
    throw error; // the redirect after a successful sign-in
  }
  return { ok: true };
}

const magicSchema = z.object({ email: z.email("Enter a valid email"), next: z.string().optional() });

export async function magicLinkAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = magicSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Enter a valid email.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await signIn("email", { email: parsed.data.email, redirectTo: safeRedirect(parsed.data.next, "/app/dashboard") });
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, error: "We couldn't send the link. Please try again." };
    throw error;
  }
  return { ok: true };
}

export async function oauthAction(formData: FormData) {
  const provider = String(formData.get("provider"));
  if (provider !== "google" && provider !== "facebook") return;
  await signIn(provider, { redirectTo: safeRedirect(formData.get("next")?.toString(), "/app/dashboard") });
}

export async function signOutAction(formData?: FormData) {
  await signOut({ redirectTo: safeRedirect(formData?.get("next")?.toString(), "/") });
}

const forgotSchema = z.object({ email: z.email("Enter a valid email"), portal: z.enum(["app", "studio"]).optional() });

export async function forgotPasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = forgotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Enter a valid email.", fieldErrors: fieldErrors(parsed.error) };
  try {
    await requestPasswordReset(parsed.data.email, parsed.data.portal);
  } catch (error) {
    console.error("[auth] reset request failed", error);
  }
  return { ok: true, message: "If that email has an account, a reset link is on its way." };
}

const resetSchema = z
  .object({ token: z.string().min(10), password: passwordRule, confirm: z.string(), portal: z.string().optional() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export async function resetPasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  let address: string | null;
  try {
    address = await resetPassword(parsed.data.token, parsed.data.password);
  } catch (error) {
    if (error instanceof UserError) return { ok: false, error: error.message };
    throw error;
  }
  if (address) {
    await signIn("password", {
      email: address,
      password: parsed.data.password,
      redirectTo: parsed.data.portal === "studio" ? "/studio/dashboard" : "/app/dashboard",
    });
  }
  return { ok: true };
}
