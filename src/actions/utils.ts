import type { z } from "zod";

/** Flattens zod issues into { field: firstMessage } for inline form errors */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Only allows same-site relative paths as post-login destinations */
export function safeRedirect(target: string | null | undefined, fallback: string) {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
