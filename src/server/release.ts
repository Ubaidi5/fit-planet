import "server-only";
import path from "node:path";

/**
 * The deployed release name, so errors can be matched to a deploy. The
 * Lightsail deploy runs each release from releases/<timestamp>-<sha>.
 */
export function serverRelease() {
  const fromEnv = process.env.SENTRY_RELEASE?.trim();
  if (fromEnv) return fromEnv;
  const folder = path.basename(process.cwd());
  return /^\d{14}-[0-9a-f]{7}$/.test(folder) ? folder : undefined;
}
