import "server-only";
import { metaSink } from "./meta";
import { openaiSink } from "./openai";
import type { Conversion } from "./types";

export * from "./types";

const sinks = [metaSink, openaiSink];

/**
 * Posts a conversion to every configured ad platform. Never throws: a slow or
 * failing ad API must not break sign-up or payment.
 */
export async function sendConversion(conversion: Conversion) {
  const results = await Promise.allSettled(sinks.filter((s) => s.enabled).map((s) => s.send(conversion)));
  for (const result of results) {
    if (result.status === "rejected") console.error(`[conversions] ${conversion.kind} failed`, result.reason);
  }
}
