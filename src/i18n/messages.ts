import type { AppLocale } from "@/lib/i18n/regions";

type Tree = { [key: string]: string | Tree };

function deepMerge(base: Tree, override: Tree): Tree {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    out[key] = typeof value === "object" && typeof prev === "object" ? deepMerge(prev, value) : value;
  }
  return out;
}

/** A language's messages, with English filling any key a translation hasn't caught up with yet */
export async function loadMessages(lang: AppLocale): Promise<Tree> {
  const messages = (await import(`../../messages/${lang}.json`)).default as Tree;
  if (lang === "en") return messages;
  const fallback = (await import("../../messages/en.json")).default as Tree;
  return deepMerge(fallback, messages);
}
