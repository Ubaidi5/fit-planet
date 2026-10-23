import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getRoutine } from "@/server/modules/routines";
import { BackLink } from "@/components/routines/BackLink";
import { RoutineEditor } from "@/components/routines/RoutineEditor";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("routines.pages"))("edit") };
}

export default async function EditRoutinePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/app/routines/${id}/edit`);
  const routineId = toObjectId(id);
  const routine = routineId ? await getRoutine(user._id, routineId) : null;
  if (!routine) notFound();
  const t = await getTranslations("routines.pages");

  return (
    <div>
      <BackLink />
      <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{from === "template" ? t("makeYours") : t("edit")}</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        {from === "template" ? t("templateHint") : t("editHint")}
      </p>
      <RoutineEditor routine={routine} unit={weightUnitFor(await getRegion())} />
    </div>
  );
}
