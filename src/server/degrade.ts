import "server-only";
import { reportError } from "@/lib/monitoring";

/**
 * Graceful degradation for page data. A page is built from several
 * independent pieces (badge counts, reviews, live occupancy, stats); when one
 * of them fails, the page should still render with that piece missing rather
 * than fail as a whole. Each failure is reported once with its label.
 */

/** The value, or `fallback` when loading it throws */
export async function orFallback<T>(label: string, work: Promise<T> | (() => Promise<T>), fallback: T): Promise<T> {
  try {
    return await (typeof work === "function" ? work() : work);
  } catch (error) {
    reportError(label, error);
    return fallback;
  }
}

export type Loaded<T> = { ok: true; value: T } | { ok: false };

/**
 * Like orFallback, but tells the page that the piece is missing, so it can
 * say "couldn't load" instead of showing an empty list that looks real.
 */
export async function attempt<T>(label: string, work: Promise<T> | (() => Promise<T>)): Promise<Loaded<T>> {
  try {
    return { ok: true, value: await (typeof work === "function" ? work() : work) };
  } catch (error) {
    reportError(label, error);
    return { ok: false };
  }
}
