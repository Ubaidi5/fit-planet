import "server-only";
import { createTranslator } from "use-intl/core";
import { defaultRegion, findRegion, type Region } from "@/lib/i18n/regions";
import { loadMessages } from "@/i18n/messages";

export type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

/**
 * Translator for someone who isn't the current request, such as the
 * recipient of a push or an email, using the region saved on their account.
 */
export async function translatorFor(regionCode?: string | null, namespace?: string): Promise<{ t: Translate; region: Region }> {
  const region = findRegion(regionCode) ?? defaultRegion;
  const messages = await loadMessages(region.lang);
  const t = createTranslator({ locale: region.lang, messages, namespace: namespace as never }) as unknown as Translate;
  return { t, region };
}
