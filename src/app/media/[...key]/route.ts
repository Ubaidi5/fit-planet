import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { env } from "@/server/env";
import { resolveLocalKey } from "@/server/services/storage/local";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

/**
 * Serves locally stored uploads. In production nginx answers /media directly
 * from disk and this route is never hit; it exists for development and as a
 * fallback if nginx isn't configured yet.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ key: string[] }> }) {
  if (env.storage.provider !== "local") return new NextResponse("Not found", { status: 404 });
  const { key } = await ctx.params;
  try {
    const file = resolveLocalKey(key.join("/"));
    const info = await stat(file);
    if (!info.isFile()) throw new Error("not a file");
    const body = await readFile(file);
    const ext = file.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(body, {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
