import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getRoutine } from "@/server/modules/routines";
import { BackLink } from "@/components/routines/BackLink";
import { RoutineEditor } from "@/components/routines/RoutineEditor";
import { findRegion } from "@/lib/i18n/regions";
import { weightUnitFor } from "@/lib/routines";

export const metadata: Metadata = { title: "Edit routine" };

export default async function EditRoutinePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/app/routines/${id}/edit`);
  const routineId = toObjectId(id);
  const routine = routineId ? await getRoutine(user._id, routineId) : null;
  if (!routine) notFound();

  return (
    <div>
      <BackLink />
      <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{from === "template" ? "Make it yours" : "Edit routine"}</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        {from === "template" ? "The template is saved to your routines. Adjust sets, weights and rest, then save." : "Changes apply to your next workout."}
      </p>
      <RoutineEditor routine={routine} unit={weightUnitFor(findRegion(user.regionCode))} />
    </div>
  );
}
