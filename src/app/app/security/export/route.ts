import { getSessionUser } from "@/server/session";
import { exportAccount } from "@/server/modules/privacy";
import { allow } from "@/server/rate-limit";

export const dynamic = "force-dynamic";

/** Downloads everything stored about the signed-in person as JSON */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(await allow("data-export", user._id.toHexString(), 5, 3600))) return new Response("Too many requests", { status: 429 });
  const data = await exportAccount(user._id);
  const day = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="fit-planet-data-${day}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
