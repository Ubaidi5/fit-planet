import "server-only";
import { headers } from "next/headers";
import { getDb } from "@/server/db/client";

interface WindowDoc {
  _id: string;
  count: number;
  expiresAt: Date;
}

let indexReady: Promise<unknown> | null = null;

async function windows() {
  const collection = (await getDb()).collection<WindowDoc>("rate_limits");
  // Mongo removes finished windows by itself
  indexReady ??= collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => (indexReady = null));
  await indexReady;
  return collection;
}

/**
 * Fixed-window counter shared by every app instance. Returns false once
 * `limit` hits have been counted for this key in the current window.
 * If the database is unreachable the request is allowed: the limiter must
 * never become the outage.
 */
export async function allow(bucket: string, key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const windowMs = windowSeconds * 1000;
  const slot = Math.floor(Date.now() / windowMs);
  try {
    const doc = await (await windows()).findOneAndUpdate(
      { _id: `${bucket}:${key}:${slot}` },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((slot + 1) * windowMs) } },
      { upsert: true, returnDocument: "after" },
    );
    return (doc?.count ?? 0) <= limit;
  } catch (error) {
    console.error("[rate-limit] check failed", error);
    return true;
  }
}

/** All limits must pass; every one is counted so probing one key can't dodge another */
export async function allowAll(...checks: Parameters<typeof allow>[]) {
  const results = await Promise.all(checks.map((args) => allow(...args)));
  return results.every(Boolean);
}

/**
 * The visitor's address. nginx sets X-Real-IP and the app only listens on
 * localhost, so the header can be trusted; elsewhere fall back to the first
 * X-Forwarded-For hop.
 */
export async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}
