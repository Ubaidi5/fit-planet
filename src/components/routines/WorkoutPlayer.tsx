"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiCheck, HiOutlinePlus, HiXMark } from "react-icons/hi2";
import { finishWorkoutAction } from "@/actions/routines";
import { useToast } from "@/components/notifications/ToastProvider";
import { exerciseById, isTimed } from "@/lib/data/exercises";
import { kgToUnit, unitToKg, type WeightUnit } from "@/lib/routines";
import { exerciseName, restText, targetText } from "@/lib/i18n/training";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { RoutineItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SetRow {
  reps: string;
  weight: string;
  done: boolean;
}

interface Draft {
  startedAt: string;
  sets: SetRow[][];
}

interface Props {
  routine: { id: string; name: string; items: RoutineItem[] };
  /** Heaviest weight logged last time per exercise, in kg */
  lastWeights: Record<string, number>;
  unit: WeightUnit;
}

const draftKey = (id: string) => `fp-workout-${id}`;

function freshDraft(routine: Props["routine"], lastWeights: Props["lastWeights"], unit: WeightUnit): Draft {
  return {
    startedAt: new Date().toISOString(),
    sets: routine.items.map((item) => {
      const kg = item.weight ?? lastWeights[item.exerciseId] ?? null;
      const reps = String(Number.parseInt(item.reps, 10) || "");
      return Array.from({ length: item.sets }, () => ({ reps, weight: kg ? String(kgToUnit(kg, unit)) : "", done: false }));
    }),
  };
}

function loadDraft(props: Props): Draft {
  try {
    const raw = window.localStorage.getItem(draftKey(props.routine.id));
    if (raw) {
      const draft = JSON.parse(raw) as Draft;
      // Only resume a draft from the last six hours that still matches the routine
      const fresh = Date.now() - new Date(draft.startedAt).getTime() < 6 * 3600_000;
      if (fresh && draft.sets.length === props.routine.items.length) return draft;
    }
  } catch {
    // Storage blocked or corrupt draft: start over
  }
  return freshDraft(props.routine, props.lastWeights, props.unit);
}

function clock(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}

export function WorkoutPlayer(props: Props) {
  const { routine, unit } = props;
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("routines.player");
  const tr = useTranslations("training");
  const { region } = useLocale();
  const [draft, setDraft] = useState<Draft>(() => loadDraft(props));
  const [now, setNow] = useState(() => Date.now());
  const [rest, setRest] = useState<{ until: number; total: number } | null>(null);
  const [active, setActive] = useState(() => Math.max(0, draft.sets.findIndex((sets) => sets.some((s) => !s.done))));
  const [pending, startTransition] = useTransition();
  const [confirmQuit, setConfirmQuit] = useState(false);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey(routine.id), JSON.stringify(draft));
    } catch {
      // Not fatal: the workout just won't survive a reload
    }
  }, [draft, routine.id]);

  const elapsed = Math.max(0, Math.floor((now - new Date(draft.startedAt).getTime()) / 1000));
  const restLeft = rest ? Math.max(0, Math.ceil((rest.until - now) / 1000)) : 0;
  const total = draft.sets.reduce((s, sets) => s + sets.length, 0);
  const done = draft.sets.reduce((s, sets) => s + sets.filter((x) => x.done).length, 0);

  const volume = useMemo(() => {
    let kg = 0;
    draft.sets.forEach((sets, i) => {
      if (isTimed(routine.items[i].exerciseId)) return;
      for (const s of sets) if (s.done) kg += (Number.parseFloat(s.reps) || 0) * unitToKg(Number.parseFloat(s.weight) || 0, unit);
    });
    return Math.round(kgToUnit(kg, unit));
  }, [draft, routine.items, unit]);

  const patchSet = (ex: number, index: number, patch: Partial<SetRow>) =>
    setDraft((d) => ({ ...d, sets: d.sets.map((sets, i) => (i === ex ? sets.map((s, j) => (j === index ? { ...s, ...patch } : s)) : sets)) }));

  const toggleDone = (ex: number, index: number) => {
    const set = draft.sets[ex][index];
    patchSet(ex, index, { done: !set.done });
    if (set.done) return;
    const restSec = routine.items[ex].restSec;
    const exerciseFinished = draft.sets[ex].every((s, j) => j === index || s.done);
    if (restSec > 0) setRest({ until: Date.now() + restSec * 1000, total: restSec });
    if (exerciseFinished && ex < routine.items.length - 1) {
      setActive(ex + 1);
      window.setTimeout(() => cards.current[ex + 1]?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }
  };

  const addSet = (ex: number) =>
    setDraft((d) => ({
      ...d,
      sets: d.sets.map((sets, i) => (i === ex ? [...sets, { ...(sets.at(-1) ?? { reps: "", weight: "" }), done: false }] : sets)),
    }));

  const discard = () => {
    try {
      window.localStorage.removeItem(draftKey(routine.id));
    } catch {}
    router.push("/app/routines");
  };

  const finish = () => {
    startTransition(async () => {
      const result = await finishWorkoutAction({
        routineId: routine.id,
        startedAt: draft.startedAt,
        exercises: routine.items.map((item, i) => ({
          exerciseId: item.exerciseId,
          sets: draft.sets[i].map((s) => {
            const w = Number.parseFloat(s.weight);
            return { reps: Math.max(0, Math.round(Number.parseFloat(s.reps) || 0)), weight: Number.isFinite(w) && w > 0 ? unitToKg(w, unit) : null, done: s.done };
          }),
        })),
      });
      if (!result.ok) {
        toast.error(t("finishFailed"), result.error);
        return;
      }
      try {
        window.localStorage.removeItem(draftKey(routine.id));
      } catch {}
      router.push(`/app/routines/history/${result.data.id}?new=1`);
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Session header stays pinned while scrolling through exercises */}
      <div className="sticky top-[4.5rem] z-30 -mx-4 bg-canvas/90 px-4 pt-1 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (confirmQuit ? discard() : setConfirmQuit(true))}
            onBlur={() => setConfirmQuit(false)}
            className={cn(
              "flex h-10 shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
              confirmQuit ? "bg-stamp-magenta text-white" : "text-gray-500 hover:bg-gray-900/5",
            )}
          >
            <HiXMark className="size-4.5" />
            {confirmQuit ? t("discard") : <span className="sr-only">{t("quit")}</span>}
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold text-ink">{routine.name}</p>
            <p className="font-mono text-xs text-gray-500 tabular-nums">{clock(elapsed)}</p>
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={pending || done === 0}
            className="h-10 shrink-0 cursor-pointer rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            {pending ? t("saving") : t("finish")}
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-900/[0.07]">
          <div className="h-full rounded-full bg-volt transition-[width] duration-500" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </div>
        <p className="mt-1.5 flex justify-between text-xs text-gray-500 tabular-nums">
          <span>
            {t("setsProgress", { done, total })}
          </span>
          {volume > 0 && (
            <span>
              {t("lifted", { amount: new Intl.NumberFormat(region.locale).format(volume), unit })}
            </span>
          )}
        </p>
      </div>

      <ol className="mt-3 space-y-3 pb-40">
        {routine.items.map((item, ex) => {
          const exercise = exerciseById.get(item.exerciseId);
          if (!exercise) return null;
          const timed = isTimed(item.exerciseId);
          const sets = draft.sets[ex];
          const finished = sets.every((s) => s.done);
          const open = active === ex;
          return (
            <li
              key={`${item.exerciseId}-${ex}`}
              ref={(el) => {
                cards.current[ex] = el;
              }}
              className={cn(
                "scroll-mt-40 overflow-hidden rounded-3xl bg-surface ring-1 transition-shadow",
                open ? "shadow-lift ring-ink/10" : "shadow-soft ring-gray-900/[0.05]",
              )}
            >
              <button type="button" onClick={() => setActive(open ? -1 : ex)} className="flex w-full cursor-pointer items-center gap-3 p-4 text-start">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                    finished ? "bg-volt text-ink" : "bg-canvas text-gray-500",
                  )}
                >
                  {finished ? <HiCheck className="size-4.5" /> : String(ex + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{exerciseName(tr, exercise.id, exercise.name)}</span>
                  <span className="text-xs text-gray-500">
                    {sets.length} × {targetText(tr, item)} · {t("restShort", { rest: restText(tr, item.restSec) })}
                  </span>
                </span>
                <span className="font-mono text-xs text-gray-400 tabular-nums">
                  {sets.filter((s) => s.done).length}/{sets.length}
                </span>
              </button>

              {open && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-2 px-1 pb-1.5 text-[11px] font-medium tracking-wide text-gray-400 uppercase">
                    <span>{t("set")}</span>
                    <span>{timed ? "" : unit}</span>
                    <span>{timed ? t("seconds") : t("reps")}</span>
                    <span />
                  </div>
                  <ul className="space-y-1.5">
                    {sets.map((s, i) => (
                      <li key={i} className={cn("grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-2 rounded-2xl p-1", s.done && "bg-volt-soft")}>
                        <span className="text-center font-mono text-sm font-semibold text-gray-500">{i + 1}</span>
                        {timed ? (
                          <span />
                        ) : (
                          <input
                            value={s.weight}
                            onChange={(e) => patchSet(ex, i, { weight: e.target.value.replace(/[^0-9.]/g, "") })}
                            inputMode="decimal"
                            placeholder="0"
                            aria-label={t("weightAria", { n: i + 1, unit })}
                            className="h-11 w-full min-w-0 rounded-xl bg-canvas text-center text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-ink/15"
                          />
                        )}
                        <input
                          value={s.reps}
                          onChange={(e) => patchSet(ex, i, { reps: e.target.value.replace(/[^0-9]/g, "") })}
                          inputMode="numeric"
                          placeholder="0"
                          aria-label={timed ? t("secondsAria", { n: i + 1 }) : t("repsAria", { n: i + 1 })}
                          className="h-11 w-full min-w-0 rounded-xl bg-canvas text-center text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-ink/15"
                        />
                        <button
                          type="button"
                          onClick={() => toggleDone(ex, i)}
                          aria-pressed={s.done}
                          aria-label={t("doneAria", { n: i + 1 })}
                          className={cn(
                            "flex size-11 cursor-pointer items-center justify-center rounded-xl transition-all active:scale-90",
                            s.done ? "bg-ink text-volt" : "bg-canvas text-gray-400 hover:text-ink",
                          )}
                        >
                          <HiCheck className="size-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => addSet(ex)}
                    className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-canvas hover:text-ink"
                  >
                    <HiOutlinePlus className="size-4" />
                    {t("addSet")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Rest timer floats above the tab bar on phones */}
      {rest && restLeft > 0 && (
        <div className="fixed inset-x-3 bottom-[5.5rem] z-40 mx-auto max-w-md lg:bottom-6">
          <div className="relative overflow-hidden rounded-full bg-ink p-2 ps-5 text-white shadow-lift">
            <div
              className="absolute inset-y-0 start-0 bg-white/10 transition-[width] duration-1000 ease-linear"
              style={{ width: `${(1 - restLeft / rest.total) * 100}%` }}
            />
            <div className="relative flex items-center gap-3">
              <span className="text-xs text-white/60">{t("rest")}</span>
              <span className="flex-1 font-mono text-2xl font-semibold text-volt tabular-nums">{clock(restLeft)}</span>
              <button
                type="button"
                onClick={() => setRest((r) => (r ? { until: r.until + 15_000, total: r.total + 15 } : r))}
                className="h-10 cursor-pointer rounded-full bg-white/10 px-3.5 text-sm font-semibold"
              >
                +15s
              </button>
              <button type="button" onClick={() => setRest(null)} className="h-10 cursor-pointer rounded-full bg-volt px-4 text-sm font-semibold text-ink">
                {t("skip")}
              </button>
            </div>
          </div>
        </div>
      )}

      {done === total && total > 0 && (
        <div className="fixed inset-x-3 bottom-[5.5rem] z-40 mx-auto max-w-md lg:bottom-6">
          <button
            type="button"
            onClick={finish}
            disabled={pending}
            className="h-14 w-full cursor-pointer rounded-full bg-volt text-base font-semibold text-ink shadow-lift disabled:opacity-60"
          >
            {pending ? t("saving") : t("allDone")}
          </button>
        </div>
      )}
    </div>
  );
}
