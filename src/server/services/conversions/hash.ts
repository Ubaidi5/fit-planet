import "server-only";
import { createHash } from "node:crypto";

export const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** Digits only, with the country code; null when it can't be a full international number */
export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^00/, "");
  return digits.length >= 8 && digits.length <= 15 && phone.trim().match(/^(\+|00)/) ? digits : null;
}
