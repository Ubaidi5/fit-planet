"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { HiChevronDown, HiOutlineMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";
import { exercises, type Equipment, type Exercise, type MuscleGroup } from "@/lib/data/exercises";
import { exerciseName } from "@/lib/i18n/training";
import { cn } from "@/lib/utils";

const muscleGroups: MuscleGroup[] = ["chest", "back", "shoulders", "biceps", "triceps", "core", "quadriceps", "hamstrings", "glutes", "calves", "cardio"];
const equipmentList: Equipment[] = ["bodyweight", "barbell", "dumbbell", "cable", "machine", "treadmill", "rowing_machine"];
const levels = ["beginner", "intermediate", "advanced"] as const;

const levelTone: Record<Exercise["difficulty"], string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-stamp-ochre/10 text-stamp-ochre",
  advanced: "bg-stamp-magenta/10 text-stamp-magenta",
};

const selectClass =
  "h-10 cursor-pointer appearance-none rounded-full bg-surface ps-4 pe-9 text-sm font-medium text-gray-700 ring-1 ring-gray-900/[0.08] focus:ring-2 focus:ring-ink/15 focus:outline-none";

export default function ExerciseLibraryPage() {
  const t = useTranslations("library");
  const tr = useTranslations("training");
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [equipment, setEquipment] = useState<Equipment | "all">("all");
  const [level, setLevel] = useState<Exercise["difficulty"] | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter(
      (e) =>
        (!q || e.name.toLowerCase().includes(q) || exerciseName(tr, e.id, e.name).toLowerCase().includes(q)) &&
        (muscle === "all" || e.muscleGroup === muscle || e.secondaryMuscles?.includes(muscle)) &&
        (equipment === "all" || e.equipment.includes(equipment)) &&
        (level === "all" || e.difficulty === level),
    );
  }, [query, muscle, equipment, level, tr]);

  const filtered = query || muscle !== "all" || equipment !== "all" || level !== "all";
  const clear = () => {
    setQuery("");
    setMuscle("all");
    setEquipment("all");
    setLevel("all");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("count", { count: exercises.length })}</p>
          <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("title")}</h1>
        </div>
        <Link
          href="/app/routines/new"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink ps-4 pe-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <HiOutlinePlus className="size-4.5" />
          <span className="hidden sm:inline">{t("build")}</span>
          <span className="sm:hidden">{t("buildShort")}</span>
        </Link>
      </div>

      <label className="mt-6 flex h-12 items-center gap-2 rounded-full bg-surface px-4 shadow-soft ring-1 ring-gray-900/[0.05] focus-within:ring-ink/20">
        <HiOutlineMagnifyingGlass className="size-5 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          aria-label={t("search")}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-gray-400"
        />
      </label>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterSelect label={t("muscle")} value={muscle} onChange={(v) => setMuscle(v as MuscleGroup | "all")}>
          <option value="all">{t("allMuscles")}</option>
          {muscleGroups.map((m) => (
            <option key={m} value={m}>
              {tr(`muscles.${m}`)}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label={t("equipment")} value={equipment} onChange={(v) => setEquipment(v as Equipment | "all")}>
          <option value="all">{t("allEquipment")}</option>
          {equipmentList.map((e) => (
            <option key={e} value={e}>
              {tr(`equipment.${e}`)}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label={t("level")} value={level} onChange={(v) => setLevel(v as Exercise["difficulty"] | "all")}>
          <option value="all">{t("allLevels")}</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {tr(`difficulty.${l}`)}
            </option>
          ))}
        </FilterSelect>
        {filtered && (
          <button type="button" onClick={clear} className="h-10 shrink-0 cursor-pointer rounded-full px-3 text-sm font-medium text-gray-500 hover:text-ink">
            {t("clear")}
          </button>
        )}
      </div>

      <p className="mt-5 mb-3 text-sm text-gray-500" aria-live="polite">
        {t("showing", { shown: results.length, total: exercises.length })}
      </p>

      {results.length === 0 ? (
        <div className="rounded-[1.75rem] border-2 border-dashed border-gray-900/10 px-6 py-12 text-center">
          <p className="font-semibold text-ink">{t("empty")}</p>
          <button type="button" onClick={clear} className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
            {t("clear")}
          </button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {results.map((e) => {
            const expanded = open === e.id;
            return (
              <li key={e.id} className="overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : e.id)}
                  aria-expanded={expanded}
                  className="flex w-full cursor-pointer items-center gap-3 p-4 text-start sm:p-5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-volt-soft font-mono text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
                    {tr(`muscles.${e.muscleGroup}`).slice(0, 3)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{exerciseName(tr, e.id, e.name)}</span>
                    <span className="block truncate text-sm text-gray-500">
                      {[e.muscleGroup, ...(e.secondaryMuscles ?? [])].map((m) => tr(`muscles.${m}`)).join(" · ")}
                    </span>
                  </span>
                  <span className={cn("hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline", levelTone[e.difficulty])}>
                    {tr(`difficulty.${e.difficulty}`)}
                  </span>
                  <HiChevronDown className={cn("size-5 shrink-0 text-gray-400 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                {expanded && (
                  <div className="space-y-4 border-t border-dashed border-gray-900/10 px-4 pt-4 pb-5 sm:px-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold sm:hidden", levelTone[e.difficulty])}>{tr(`difficulty.${e.difficulty}`)}</span>
                      {e.equipment.map((item) => (
                        <span key={item} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-gray-600">
                          {tr(`equipment.${item}`)}
                        </span>
                      ))}
                    </div>
                    {/* Descriptions and steps are English-only content for now */}
                    <p className="text-[15px] leading-relaxed text-gray-700" lang="en">
                      {e.description}
                    </p>
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("how")}</p>
                      <ol className="mt-2 space-y-2" lang="en">
                        {e.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-700">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-canvas font-mono text-[11px] font-semibold text-gray-500">{i + 1}</span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {e.tips && e.tips.length > 0 && (
                      <div className="rounded-2xl bg-volt-soft/70 p-4">
                        <p className="font-mono text-[11px] tracking-[0.14em] text-emerald-800 uppercase">{t("tips")}</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-emerald-900" lang="en">
                          {e.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {children}
      </select>
      <HiChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
