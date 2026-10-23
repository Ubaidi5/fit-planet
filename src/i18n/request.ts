import { getRequestConfig } from "next-intl/server";
import { getRegion } from "@/lib/i18n/server";
import { loadMessages } from "./messages";

export default getRequestConfig(async () => {
  const region = await getRegion();
  return {
    locale: region.lang,
    messages: await loadMessages(region.lang),
    timeZone: "UTC",
  };
});
