import type { Metadata } from "next";
import { requireUser } from "@/server/session";
import { BackLink } from "@/components/routines/BackLink";
import { RoutineEditor } from "@/components/routines/RoutineEditor";
import { findRegion } from "@/lib/i18n/regions";
import { weightUnitFor } from "@/lib/routines";

export const metadata: Metadata = { title: "New routine" };

export default async function NewRoutinePage() {
  const user = await requireUser("/app/routines/new");
  return (
    <div>
      <BackLink />
      <h1 className="mt-2 mb-6 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">New routine</h1>
      <RoutineEditor unit={weightUnitFor(findRegion(user.regionCode))} />
    </div>
  );
}
