import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/session";
import { toObjectId } from "@/server/db/collections";
import { getWorkout } from "@/server/modules/routines";
import { BackLink } from "@/components/routines/BackLink";
import { ShareToFeed } from "@/components/social/ShareToFeed";
import { exerciseById, isTimed } from "@/lib/data/exercises";
import { getRegion } from "@/lib/i18n/server";
import { kgToUnit, weightUnitFor } from "@/lib/routines";
import { cn } from "@/lib/utils";
import { exerciseName } from "@/lib/i18n/training";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("routines.summary"))("meta") };
}

export default async function WorkoutSummaryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/app/routines/history/${id}`);
  const workoutId = toObjectId(id);
  const workout = workoutId ? await getWorkout(user._id, workoutId) : null;
  if (!workout) notFound();

  const [t, tr, region] = await Promise.all([getTranslations("routines.summary"), getTranslations("training"), getRegion()]);
  const unit = weightUnitFor(region);
  const number = new Intl.NumberFormat(region.locale);
  const date = new Intl.DateTimeFormat(region.locale, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
  const justFinished = query.new === "1";

  const stats = [
    { label: t("time"), value: `${workout.durationMin}`, unit: t("min") },
    { label: t("sets"), value: `${workout.setsDone}`, unit: t("done") },
    { label: t("volume"), value: number.format(kgToUnit(workout.volumeKg, unit)), unit },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink />
      <section className="mt-2 overflow-hidden rounded-[2rem] bg-ink text-white shadow-pass">
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">{justFinished ? t("complete") : t("workout")}</p>
          <h1 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] sm:text-4xl">{workout.routineName}</h1>
          <p className="mt-1 text-sm text-white/60">{date.format(new Date(workout.completedAt))}</p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-dashed divide-white/15 border-t border-dashed border-white/15 rtl:divide-x-reverse">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center">
              <dt className="font-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">{s.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-volt tabular-nums">
                {s.value}
                <span className="ms-1 text-xs font-normal text-white/50">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ol className="mt-4 space-y-3">
        {workout.exercises.map((e, i) => {
          const exercise = exerciseById.get(e.exerciseId);
          if (!exercise) return null;
          const timed = isTimed(e.exerciseId);
          return (
            <li key={`${e.exerciseId}-${i}`} className="rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
              <p className="font-semibold text-ink">{exerciseName(tr, exercise.id, exercise.name)}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.sets.map((s, j) => (
                  <li
                    key={j}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm tabular-nums",
                      s.done ? "bg-canvas font-medium text-ink" : "bg-transparent text-gray-400 line-through ring-1 ring-gray-900/10",
                    )}
                  >
                    {timed ? `${s.reps}s` : s.weight ? `${kgToUnit(s.weight, unit)} ${unit} × ${s.reps}` : tr("targetReps", { reps: s.reps })}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ShareToFeed kind="workout" id={workout.id} title={workout.routineName} className="flex h-12 flex-1 items-center justify-center rounded-full bg-volt text-sm font-semibold text-ink" />
        {workout.routineId && (
          <Link href={`/app/routines/${workout.routineId}/start`} className="flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            {t("again")}
          </Link>
        )}
        <Link href="/app/routines" className="flex h-12 flex-1 items-center justify-center rounded-full border border-gray-900/10 text-sm font-semibold text-ink hover:bg-surface">
          {t("back")}
        </Link>
      </div>
    </div>
  );
}
