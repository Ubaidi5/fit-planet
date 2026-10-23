import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireUser } from "@/server/session";
import { BackLink } from "@/components/routines/BackLink";
import { RoutineEditor } from "@/components/routines/RoutineEditor";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("routines.pages"))("new") };
}

export default async function NewRoutinePage() {
  await requireUser("/app/routines/new");
  const t = await getTranslations("routines.pages");
  return (
    <div>
      <BackLink />
      <h1 className="mt-2 mb-6 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("new")}</h1>
      <RoutineEditor unit={weightUnitFor(await getRegion())} />
    </div>
  );
}
