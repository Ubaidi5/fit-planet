import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { env } from "@/server/env";
import { releaseAbandonedCheckouts, sendPassReminders } from "@/server/modules/reminders";
import { reportError } from "@/lib/monitoring";

const jobs: Record<string, () => Promise<object>> = {
  hourly: async () => ({ ...(await sendPassReminders()), ...(await releaseAbandonedCheckouts()) }),
};

function authorized(request: Request) {
  if (!env.cronSecret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${env.cronSecret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Called by the server's crontab (see deploy/setup-server.sh) */
export async function POST(request: Request, ctx: { params: Promise<{ job: string }> }) {
  if (!authorized(request)) return new NextResponse("Unauthorized", { status: 401 });
  const { job } = await ctx.params;
  const run = jobs[job];
  if (!run) return new NextResponse("Not found", { status: 404 });
  try {
    return NextResponse.json({ ok: true, ...(await run()) });
  } catch (error) {
    reportError(`[cron] ${job} failed`, error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
