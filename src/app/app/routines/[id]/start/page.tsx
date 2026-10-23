import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getRoutine, lastWeights } from "@/server/modules/routines";
import { WorkoutPlayerClient } from "@/components/routines/WorkoutPlayerClient";
import { getRegion } from "@/lib/i18n/server";
import { weightUnitFor } from "@/lib/routines";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("routines.pages"))("workout") };
}

export default async function StartWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/routines/${id}/start`);
  const routineId = toObjectId(id);
  const routine = routineId ? await getRoutine(user._id, routineId) : null;
  if (!routine) notFound();
  const weights = await lastWeights(
    user._id,
    routine.items.map((i) => i.exerciseId),
  );

  return <WorkoutPlayerClient routine={routine} lastWeights={weights} unit={weightUnitFor(await getRegion())} />;
}
