"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { registerWithPassword, requestPasswordReset, resetPassword, UserError } from "@/server/modules/users";
import { done, fail, invalid, safeRedirect } from "./utils";

const passwordRule = z.string().min(8, "passwordLength").max(128);

const registerSchema = z.object({
  name: z.string().trim().min(2, "name").max(80),
  email: z.email("email"),
  password: passwordRule,
  phone: z.string().trim().max(24).optional(),
  next: z.string().optional(),
});

/** Creates an email + password account and signs straight in */
export async function registerAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  try {
    await registerWithPassword(parsed.data);
  } catch (error) {
    if (error instanceof UserError) return fail(error.key, error.values);
    console.error("[auth] register failed", error);
    return fail("registerFailed");
  }

  await signIn("password", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: safeRedirect(parsed.data.next, "/app/dashboard"),
  });
  return { ok: true };
}

const loginSchema = z.object({
  email: z.email("email"),
  password: z.string().min(1, "password"),
  next: z.string().optional(),
});

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  try {
    await signIn("password", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeRedirect(parsed.data.next, "/app/dashboard"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return fail(error.type === "CredentialsSignin" ? "badCredentials" : "signInFailed");
    }
    throw error; // the redirect after a successful sign-in
  }
  return { ok: true };
}

const magicSchema = z.object({ email: z.email("email"), next: z.string().optional() });

export async function magicLinkAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = magicSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, "validEmail");
  try {
    await signIn("email", { email: parsed.data.email, redirectTo: safeRedirect(parsed.data.next, "/app/dashboard") });
  } catch (error) {
    if (error instanceof AuthError) return fail("linkFailed");
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

const forgotSchema = z.object({ email: z.email("email"), portal: z.enum(["app", "studio"]).optional() });

export async function forgotPasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = forgotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, "validEmail");
  try {
    await requestPasswordReset(parsed.data.email, parsed.data.portal);
  } catch (error) {
    console.error("[auth] reset request failed", error);
  }
  return done("resetSent");
}

const resetSchema = z
  .object({ token: z.string().min(10), password: passwordRule, confirm: z.string(), portal: z.string().optional() })
  .refine((v) => v.password === v.confirm, { message: "passwordsMatch", path: ["confirm"] });

export async function resetPasswordAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);
  let address: string | null;
  try {
    address = await resetPassword(parsed.data.token, parsed.data.password);
  } catch (error) {
    if (error instanceof UserError) return fail(error.key, error.values);
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
