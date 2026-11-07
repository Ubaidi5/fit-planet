import { getTranslations } from "next-intl/server";
import type { z } from "zod";
import { AppError } from "@/server/errors";
import { reportError } from "@/lib/monitoring";

type Values = Record<string, string | number>;

/** A failed action, in the viewer's language */
export async function fail(key: string, values?: Values) {
  const t = await getTranslations("feedback.errors");
  return { ok: false as const, error: t(key, values) };
}

/** A successful action with a confirmation line */
export async function done<T extends object = object>(key: string, values?: Values, extra?: T): Promise<{ ok: true; message: string } & T> {
  const t = await getTranslations("feedback.done");
  return { ok: true as const, message: t(key, values), ...(extra as T) };
}

/** Maps a thrown AppError to its message, and anything else to a logged generic failure */
export async function failFrom(error: unknown, fallbackKey: string, logLabel: string) {
  if (error instanceof AppError) return fail(error.key, error.values);
  reportError(logLabel, error);
  return fail(fallbackKey);
}

/** Validation failure: a summary line plus { field: message } for inline form errors */
export async function invalid(error: z.ZodError, key = "checkFields") {
  const t = await getTranslations("feedback");
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (!field || out[field]) continue;
    // Schemas name a message key; zod's own messages fall back to a generic line per issue type
    const own = `fields.${issue.message}`;
    out[field] = t.has(own) ? t(own) : t(issue.code === "too_big" ? "fields.tooLong" : issue.code === "too_small" ? "fields.tooShort" : "fields.invalid");
  }
  return { ok: false as const, error: t(`errors.${key}`), fieldErrors: out };
}

/** Only allows same-site relative paths as post-login destinations */
export function safeRedirect(target: string | null | undefined, fallback: string) {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
