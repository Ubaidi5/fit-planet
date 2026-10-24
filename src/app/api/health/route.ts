import { getDb, isDbConfigured } from "@/server/db/client";

export const dynamic = "force-dynamic";

/**
 * For the deploy script and uptime monitors: 200 when the app and database
 * answer, 503 otherwise. Says nothing about configuration or versions.
 */
export async function GET() {
  let db: "ok" | "down" = "down";
  if (isDbConfigured()) {
    try {
      const ping = (await getDb()).command({ ping: 1 });
      await Promise.race([ping, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000))]);
      db = "ok";
    } catch (error) {
      console.error("[health] database ping failed", error);
    }
  }
  const ok = db === "ok";
  return Response.json({ status: ok ? "ok" : "degraded", db }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
