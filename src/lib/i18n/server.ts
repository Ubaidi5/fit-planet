import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { findRegion, guessRegion, parseAcceptLanguage, REGION_COOKIE, type Region } from "./regions";

/** The viewer's region: their saved choice, otherwise a guess from the browser's languages */
export const getRegion = cache(async (): Promise<Region> => {
  const [jar, head] = await Promise.all([cookies(), headers()]);
  const saved = findRegion(jar.get(REGION_COOKIE)?.value);
  if (saved) return saved;
  return guessRegion(parseAcceptLanguage(head.get("accept-language")));
});
