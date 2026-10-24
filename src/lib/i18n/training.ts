import { exerciseById, isTimed } from "@/lib/data/exercises";

/** Translator for the "training" messages, from useTranslations or getTranslations */
type Translator = { (key: string, values?: Record<string, string | number>): string; has: (key: string) => boolean };

/** "8-10 reps" or "45 s" */
export function targetText(t: Translator, item: { exerciseId: string; reps: string }) {
  return isTimed(item.exerciseId) ? t("targetSec", { reps: item.reps }) : t("targetReps", { reps: item.reps });
}

export function restText(t: Translator, sec: number) {
  if (sec < 60) return t("restSec", { sec });
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}:${String(s).padStart(2, "0")}` : t("restMin", { m });
}

/** Catalogue exercises have translated names; anything else keeps its stored name */
export function exerciseName(t: Translator, exerciseId: string, fallback?: string) {
  const key = `exercises.${exerciseId}`;
  return t.has(key) ? t(key) : (fallback ?? exerciseById.get(exerciseId)?.name ?? exerciseId);
}
