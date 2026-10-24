import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { HiOutlinePlus, HiPlay } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { listRoutines, recentWorkouts } from "@/server/modules/routines";
import { copyTemplateAction } from "@/actions/routines";
import { RoutineMenu } from "@/components/routines/RoutineMenu";
import { routineTemplates } from "@/lib/data/exercises";
import { findCountry } from "@/lib/data/countries";
import { addDays, todayIn } from "@/lib/dates";
import { getRegion } from "@/lib/i18n/server";
import { estimateMinutes, kgToUnit, musclesOf, totalSets, weightUnitFor, type WeightUnit } from "@/lib/routines";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("routines"))("title") };
}

const spine: Record<string, string> = {
  push: "bg-stamp-magenta",
  pull: "bg-stamp-teal",
  legs: "bg-stamp-violet",
  core: "bg-stamp-ochre",
  cardio: "bg-stamp-magenta",
};

export default async function RoutinesPage() {
  const user = await requireUser("/app/routines");
  const [t, tr, region] = await Promise.all([getTranslations("routines"), getTranslations("training"), getRegion()]);
  const [routines, workouts] = await Promise.all([listRoutines(user._id), recentWorkouts(user._id, 30)]);

  // The last seven days, in the member's own timezone when we know their country
  const timeZone = findCountry(user.regionCode?.slice(0, 2) ?? "")?.timezone ?? "UTC";
  const today = todayIn(timeZone);
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const dayOf = (iso: string) => todayIn(timeZone, new Date(iso));
  const trainedDays = new Set(workouts.map((w) => dayOf(w.completedAt)));
  const thisWeek = workouts.filter((w) => dayOf(w.completedAt) >= days[0]);
  const weekMinutes = thisWeek.reduce((s, w) => s + w.durationMin, 0);
  const weekVolume = thisWeek.reduce((s, w) => s + w.volumeKg, 0);
  const weekday = new Intl.DateTimeFormat(region.locale, { weekday: "narrow", timeZone: "UTC" });
  const when = new Intl.DateTimeFormat(region.locale, { weekday: "short", day: "numeric", month: "short", timeZone });
  const number = new Intl.NumberFormat(region.locale);
  const unit = weightUnitFor(region);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="min-w-0">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("eyebrow")}</p>
            <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("title")}</h1>
          </div>
          <Link
            href="/app/routines/new"
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink ps-4 pe-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            <HiOutlinePlus className="size-4.5" />
            {t("new")}
          </Link>
        </div>

        {/* Week at a glance: on mobile it sits on top, on desktop it moves to the side column */}
        <WeekCard locale={region.locale} className="mt-6 lg:hidden" days={days} trained={trainedDays} today={today} weekday={weekday} count={thisWeek.length} minutes={weekMinutes} volume={kgToUnit(weekVolume, unit)} unit={unit} />

        {routines.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-12 text-center">
            <p className="font-semibold text-ink">{t("empty.title")}</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              {t("empty.text")}
            </p>
            <Link href="/app/routines/new" className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
              {t("empty.cta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 xl:grid-cols-2">
            {routines.map((r) => {
              const muscles = musclesOf(r.items, 3);
              return (
                <li key={r.id} className="relative flex overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
                  <span aria-hidden className={cn("w-1.5 shrink-0", spine[r.category] ?? "bg-ink")} />
                  <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">{tr.has(`categories.${r.category}`) ? tr(`categories.${r.category}`) : tr("categories.custom")}</p>
                        <h2 className="mt-0.5 truncate text-[17px] font-semibold tracking-tight text-ink">{r.name}</h2>
                      </div>
                      <div className="-me-2 -mt-1.5">
                        <RoutineMenu id={r.id} name={r.name} favorite={r.favorite} />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("cardSummary", { exercises: r.items.length, sets: totalSets(r.items), minutes: estimateMinutes(r.items) })}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {muscles.map((m) => (
                        <span key={m.id} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-gray-600">
                          {tr(`muscles.${m.id}`)}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-gray-900/10 pt-3">
                      <p className="truncate text-xs text-gray-500">
                        {r.timesCompleted > 0 && r.lastCompletedAt
                          ? t("done", { count: r.timesCompleted, date: when.format(new Date(r.lastCompletedAt)) })
                          : t("notDone")}
                      </p>
                      <Link
                        href={`/app/routines/${r.id}/start`}
                        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-volt ps-3.5 pe-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
                      >
                        <HiPlay className="size-4" />
                        {t("start")}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight text-ink">{t("templates")}</h2>
          <p className="mt-0.5 text-sm text-gray-500">{t("templatesHint")}</p>
          <ul className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-3">
            {routineTemplates.map((tpl) => (
              <li key={tpl.id} className="flex w-64 shrink-0 snap-start flex-col rounded-3xl bg-surface p-4 ring-1 ring-gray-900/[0.06] sm:w-auto">
                <p className="font-mono text-[10px] tracking-[0.14em] text-gray-400 uppercase">
                  {t("templateSummary", { exercises: tpl.items.length, minutes: estimateMinutes(tpl.items) })}
                </p>
                <p className="mt-1 font-semibold text-ink">{tr(`templates.${tpl.id}.name`)}</p>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">{tr(`templates.${tpl.id}.notes`)}</p>
                <form action={copyTemplateAction.bind(null, tpl.id)} className="mt-4">
                  <button
                    type="submit"
                    className="h-10 w-full cursor-pointer rounded-full border border-gray-900/10 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
                  >
                    {t("useTemplate")}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="grid gap-4 lg:sticky lg:top-24">
        <WeekCard locale={region.locale} className="hidden lg:block" days={days} trained={trainedDays} today={today} weekday={weekday} count={thisWeek.length} minutes={weekMinutes} volume={kgToUnit(weekVolume, unit)} unit={unit} />
        <section className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05]">
          <h2 className="text-base font-semibold text-ink">{t("recent")}</h2>
          {workouts.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{t("noRecent")}</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-900/[0.06]">
              {workouts.slice(0, 8).map((w) => (
                <li key={w.id}>
                  <Link href={`/app/routines/history/${w.id}`} className="-mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-canvas">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{w.routineName}</span>
                      <span className="text-xs text-gray-500">{when.format(new Date(w.completedAt))}</span>
                    </span>
                    <span className="shrink-0 text-end text-xs text-gray-500 tabular-nums">
                      <span className="block font-semibold text-ink">{t("minutes", { count: w.durationMin })}</span>
                      {w.volumeKg > 0 ? `${number.format(kgToUnit(w.volumeKg, unit))} ${unit}` : t("sets", { count: w.setsDone })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <Link href="/app/exercises" className="rounded-3xl bg-canvas-deep px-5 py-4 text-sm font-medium text-ink hover:bg-gray-200/70">
          {t("library")} <span className="rtl:hidden">→</span><span className="hidden rtl:inline">←</span>
        </Link>
      </aside>
    </div>
  );
}

async function WeekCard({
  locale,
  className,
  days,
  trained,
  today,
  weekday,
  count,
  minutes,
  volume,
  unit,
}: {
  locale: string;
  className?: string;
  days: string[];
  trained: Set<string>;
  today: string;
  weekday: Intl.DateTimeFormat;
  count: number;
  minutes: number;
  volume: number;
  unit: WeightUnit;
}) {
  const t = await getTranslations("routines.week");
  return (
    <section className={cn("rounded-3xl bg-ink p-5 text-white", className)}>
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">{t("title")}</p>
        <p className="text-sm text-white/70">
          {t.rich("workouts", { count, n: (c) => <span className="text-2xl font-semibold text-volt tabular-nums">{c}</span> })}
        </p>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const done = trained.has(d);
          return (
            <li key={d} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex aspect-square w-full max-w-10 items-center justify-center rounded-full text-xs font-semibold",
                  done ? "bg-volt text-ink" : "bg-white/[0.08] text-white/40",
                  d === today && !done && "ring-1 ring-white/40",
                )}
              >
                {Number(d.slice(8))}
              </span>
              <span className="text-[10px] text-white/40">{weekday.format(new Date(`${d}T12:00:00Z`))}</span>
            </li>
          );
        })}
      </ol>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <div>
          <dt className="text-xs text-white/50">{t("time")}</dt>
          <dd className="text-lg font-semibold tabular-nums">{t("minutes", { count: minutes })}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/50">{t("volume")}</dt>
          <dd className="text-lg font-semibold tabular-nums">{new Intl.NumberFormat(locale).format(volume)} {unit}</dd>
        </div>
      </dl>
    </section>
  );
}
