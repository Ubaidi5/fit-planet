import type { Region } from "@/lib/i18n/regions";
import { exerciseById, formatMuscleGroup, isTimed, ROUTINE_CATEGORIES, type MuscleGroup } from "@/lib/data/exercises";
import type { RoutineItem } from "@/lib/types";

/** Rough session length: each set's work plus its rest, rounded to 5 minutes */
export function estimateMinutes(items: RoutineItem[]) {
  const seconds = items.reduce((sum, item) => {
    const work = isTimed(item.exerciseId) ? Number.parseInt(item.reps, 10) || 45 : 40;
    return sum + item.sets * (work + item.restSec);
  }, 0);
  return Math.max(5, Math.round(seconds / 60 / 5) * 5);
}

export function totalSets(items: RoutineItem[]) {
  return items.reduce((sum, item) => sum + item.sets, 0);
}

/** Distinct primary muscle groups, in routine order */
export function musclesOf(items: { exerciseId: string }[], limit = 4) {
  const seen = new Set<MuscleGroup>();
  for (const item of items) {
    const group = exerciseById.get(item.exerciseId)?.muscleGroup;
    if (group) seen.add(group);
  }
  return [...seen].slice(0, limit).map((g) => ({ id: g, label: formatMuscleGroup(g) }));
}

export function categoryLabel(value: string) {
  return ROUTINE_CATEGORIES.find((c) => c.value === value)?.label ?? "Custom";
}

/** "8-10 reps" or "45 s" */
export function targetLabel(item: Pick<RoutineItem, "exerciseId" | "reps">) {
  return isTimed(item.exerciseId) ? `${item.reps} s` : `${item.reps} reps`;
}

export function formatRest(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}:${String(s).padStart(2, "0")}` : `${m} min`;
}

export type WeightUnit = "kg" | "lb";

const LB_PER_KG = 2.20462;

/** Weights are stored in kg; imperial regions see and type pounds */
export function weightUnitFor(region: Pick<Region, "units"> | null | undefined): WeightUnit {
  return region?.units === "imperial" ? "lb" : "kg";
}

export function kgToUnit(kg: number, unit: WeightUnit) {
  return unit === "lb" ? Math.round(kg * LB_PER_KG * 2) / 2 : Math.round(kg * 10) / 10;
}

export function unitToKg(value: number, unit: WeightUnit) {
  return unit === "lb" ? Math.round((value / LB_PER_KG) * 100) / 100 : value;
}
