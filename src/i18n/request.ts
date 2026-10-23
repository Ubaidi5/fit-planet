import { getRequestConfig } from "next-intl/server";
import { getRegion } from "@/lib/i18n/server";

export default getRequestConfig(async () => {
  const region = await getRegion();
  const messages = (await import(`../../messages/${region.lang}.json`)).default;
  // English fills any key a translation hasn't caught up with yet
  const fallback = region.lang === "en" ? messages : (await import("../../messages/en.json")).default;
  return {
    locale: region.lang,
    messages: deepMerge(fallback, messages),
    timeZone: "UTC",
  };
});

type Tree = { [key: string]: string | Tree };

function deepMerge(base: Tree, override: Tree): Tree {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    out[key] = typeof value === "object" && typeof prev === "object" ? deepMerge(prev, value) : value;
  }
  return out;
}
