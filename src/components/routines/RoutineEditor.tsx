"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineXMark,
  HiCheck,
  HiMinus,
  HiPlus,
} from "react-icons/hi2";
import { saveRoutineAction } from "@/actions/routines";
import { useToast } from "@/components/notifications/ToastProvider";
import { exerciseById, exercises, formatMuscleGroup, isTimed, ROUTINE_CATEGORIES, type MuscleGroup } from "@/lib/data/exercises";
import { estimateMinutes, formatRest, kgToUnit, totalSets, unitToKg, type WeightUnit } from "@/lib/routines";
import type { RoutineItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const REST_OPTIONS = [30, 45, 60, 90, 120, 180];
const MUSCLE_FILTERS: MuscleGroup[] = ["chest", "back", "shoulders", "biceps", "triceps", "quadriceps", "hamstrings", "core", "cardio"];

interface EditorItem extends Omit<RoutineItem, "weight"> {
  key: string;
  /** Text in the viewer's unit, so partial input like "22." survives typing */
  weightText: string;
}

interface Props {
  routine?: { id: string; name: string; category: string; notes: string; items: RoutineItem[] };
  unit: WeightUnit;
}

let keySeq = 0;
const nextKey = () => `item-${++keySeq}`;

export function RoutineEditor({ routine, unit }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(routine?.name ?? "");
  const [category, setCategory] = useState(routine?.category ?? "custom");
  const [notes, setNotes] = useState(routine?.notes ?? "");
  const [items, setItems] = useState<EditorItem[]>(() =>
    (routine?.items ?? []).map((i) => ({ ...i, key: nextKey(), weightText: i.weight ? String(kgToUnit(i.weight, unit)) : "" })),
  );
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asItems = (list: EditorItem[]): RoutineItem[] =>
    list.map(({ exerciseId, sets, reps, restSec, weightText }) => {
      const value = Number.parseFloat(weightText);
      return { exerciseId, sets, reps, restSec, weight: Number.isFinite(value) && value > 0 ? unitToKg(value, unit) : null };
    });

  const update = (key: string, patch: Partial<EditorItem>) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const move = (index: number, by: -1 | 1) =>
    setItems((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item);
      return next;
    });

  const addExercises = (ids: string[]) => {
    setItems((list) => [
      ...list,
      ...ids.map((exerciseId) => ({
        key: nextKey(),
        exerciseId,
        sets: 3,
        reps: isTimed(exerciseId) ? "45" : "8-12",
        restSec: isTimed(exerciseId) ? 30 : 90,
        weightText: "",
      })),
    ]);
    setPicking(false);
  };

  const save = () => {
    setError(null);
    startTransition(async () => {
      const result = await saveRoutineAction({ name, category, notes, items: asItems(items) }, routine?.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      toast.success(routine ? "Routine saved" : "Routine created");
      router.push("/app/routines");
      router.refresh();
    });
  };

  const summary = asItems(items);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="min-w-0 space-y-4">
        <section className="rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-6">
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Routine name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Monday push"
              className="mt-1 w-full border-0 border-b border-gray-900/10 bg-transparent pb-2 text-2xl font-semibold tracking-tight text-ink outline-none placeholder:text-gray-300 focus:border-ink"
            />
          </label>
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {ROUTINE_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                aria-pressed={category === c.value}
                className={cn(
                  "h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-sm font-medium transition-colors",
                  category === c.value ? "bg-ink text-white" : "bg-canvas text-gray-600 hover:bg-canvas-deep",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Notes (optional): focus, cues, what to change next time"
            className="mt-4 w-full resize-none rounded-2xl bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-ink/10"
          />
        </section>

        <ol className="space-y-3">
          {items.map((item, index) => {
            const exercise = exerciseById.get(item.exerciseId);
            if (!exercise) return null;
            const timed = isTimed(item.exerciseId);
            return (
              <li key={item.key} className="rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-volt-soft font-mono text-xs font-semibold text-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{exercise.name}</p>
                    <p className="text-xs text-gray-500">{formatMuscleGroup(exercise.muscleGroup)}</p>
                  </div>
                  <div className="-me-1.5 -mt-1 flex">
                    <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                      <HiChevronUp className="size-4.5" />
                    </IconButton>
                    <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                      <HiChevronDown className="size-4.5" />
                    </IconButton>
                    <IconButton label={`Remove ${exercise.name}`} onClick={() => setItems((list) => list.filter((i) => i.key !== item.key))}>
                      <HiOutlineXMark className="size-4.5" />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[auto_1fr_1fr]">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs font-medium text-gray-500">Sets</span>
                    <div className="mt-1 flex h-11 items-center rounded-full bg-canvas p-1">
                      <button
                        type="button"
                        aria-label="Fewer sets"
                        disabled={item.sets <= 1}
                        onClick={() => update(item.key, { sets: item.sets - 1 })}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-surface disabled:opacity-30"
                      >
                        <HiMinus className="size-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-ink tabular-nums">{item.sets}</span>
                      <button
                        type="button"
                        aria-label="More sets"
                        disabled={item.sets >= 20}
                        onClick={() => update(item.key, { sets: item.sets + 1 })}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-surface disabled:opacity-30"
                      >
                        <HiPlus className="size-4" />
                      </button>
                    </div>
                  </div>
                  <label>
                    <span className="text-xs font-medium text-gray-500">{timed ? "Seconds" : "Reps"}</span>
                    <input
                      value={item.reps}
                      onChange={(e) => update(item.key, { reps: e.target.value })}
                      maxLength={20}
                      inputMode={timed ? "numeric" : "text"}
                      className="mt-1 h-11 w-full rounded-full bg-canvas px-4 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-ink/10"
                    />
                  </label>
                  {!timed && (
                    <label>
                      <span className="text-xs font-medium text-gray-500">Weight ({unit})</span>
                      <input
                        value={item.weightText}
                        onChange={(e) => update(item.key, { weightText: e.target.value.replace(/[^0-9.]/g, "") })}
                        inputMode="decimal"
                        placeholder="Optional"
                        className="mt-1 h-11 w-full rounded-full bg-canvas px-4 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-ink/10"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500">Rest between sets</span>
                  <div className="-mx-4 mt-1 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
                    {REST_OPTIONS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => update(item.key, { restSec: sec })}
                        aria-pressed={item.restSec === sec}
                        className={cn(
                          "h-8 shrink-0 cursor-pointer rounded-full px-3 text-xs font-semibold tabular-nums transition-colors",
                          item.restSec === sec ? "bg-ink text-white" : "bg-canvas text-gray-600 hover:bg-canvas-deep",
                        )}
                      >
                        {formatRest(sec)}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => setPicking(true)}
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-gray-900/15 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-surface"
        >
          <HiOutlinePlus className="size-5" />
          Add exercises
        </button>
      </div>

      {/* Summary: a sticky bar above the tab bar on phones, a side card on desktop */}
      <aside className="fixed inset-x-3 bottom-[5.5rem] z-40 lg:sticky lg:inset-auto lg:top-24 lg:bottom-auto lg:z-auto">
        <div className="flex items-center gap-3 rounded-full bg-ink p-2 ps-5 text-white shadow-lift lg:block lg:rounded-3xl lg:p-5">
          <div className="min-w-0 flex-1 lg:mb-5">
            <p className="truncate text-sm font-semibold lg:text-base">
              {items.length} exercise{items.length === 1 ? "" : "s"} · {totalSets(summary)} sets
            </p>
            <p className="text-xs text-white/60 lg:mt-1 lg:text-sm">About {items.length ? estimateMinutes(summary) : 0} min</p>
            {error && <p className="mt-3 hidden rounded-2xl bg-stamp-magenta/20 px-3 py-2 text-sm text-white lg:block">{error}</p>}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-11 shrink-0 cursor-pointer rounded-full bg-volt px-6 text-sm font-semibold text-ink transition-opacity disabled:opacity-60 lg:w-full"
          >
            {pending ? "Saving…" : routine ? "Save changes" : "Create routine"}
          </button>
        </div>
        {error && <p className="mt-2 rounded-2xl bg-surface px-4 py-2 text-sm text-stamp-magenta shadow-soft lg:hidden">{error}</p>}
      </aside>
      {/* Keeps the last card clear of the floating bar on phones */}
      <div aria-hidden className="h-16 lg:hidden" />

      {picking && <ExercisePicker onClose={() => setPicking(false)} onAdd={addExercises} existing={new Set(items.map((i) => i.exerciseId))} />}
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-900/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ExercisePicker({ onClose, onAdd, existing }: { onClose: () => void; onAdd: (ids: string[]) => void; existing: Set<string> }) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter(
      (e) => (!muscle || e.muscleGroup === muscle || e.secondaryMuscles?.includes(muscle)) && (!q || e.name.toLowerCase().includes(q)),
    );
  }, [query, muscle]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Add exercises">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative flex max-h-[88dvh] w-full flex-col rounded-t-[2rem] bg-surface shadow-lift sm:max-w-lg sm:rounded-[2rem]">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-gray-900/15 sm:hidden" />
        <div className="flex items-center justify-between px-5 pt-4 sm:pt-5">
          <h2 className="text-lg font-semibold text-ink">Add exercises</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-900/5">
            <HiOutlineXMark className="size-5" />
          </button>
        </div>
        <div className="px-5 pt-3">
          <label className="flex h-11 items-center gap-2 rounded-full bg-canvas px-4">
            <HiOutlineMagnifyingGlass className="size-4.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-gray-400"
            />
          </label>
          <div className="-mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
            {MUSCLE_FILTERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscle(muscle === m ? null : m)}
                aria-pressed={muscle === m}
                className={cn(
                  "h-8 shrink-0 cursor-pointer rounded-full px-3 text-xs font-medium",
                  muscle === m ? "bg-ink text-white" : "bg-canvas text-gray-600",
                )}
              >
                {formatMuscleGroup(m)}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-2 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
          {results.map((e) => {
            const on = selected.includes(e.id);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-pressed={on}
                  className={cn("flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-start", on ? "bg-volt-soft" : "hover:bg-canvas")}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border",
                      on ? "border-ink bg-ink text-white" : "border-gray-900/20",
                    )}
                  >
                    {on && <HiCheck className="size-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{e.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatMuscleGroup(e.muscleGroup)}
                      {existing.has(e.id) && " · already added"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-gray-500">No exercises match.</li>}
        </ul>
        <div className="border-t border-gray-900/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => onAdd(selected)}
            className="h-12 w-full cursor-pointer rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-40"
          >
            {selected.length ? `Add ${selected.length} exercise${selected.length === 1 ? "" : "s"}` : "Select exercises"}
          </button>
        </div>
      </div>
    </div>
  );
}
