"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { copyTemplate, deleteRoutine, logWorkout, RoutineError, saveRoutine, setFavorite } from "@/server/modules/routines";
import { fail, invalid } from "./utils";
import { allow } from "@/server/rate-limit";

/** Generous for real training, but stops a script filling the database */
const underLimit = (userId: { toHexString(): string }) => allow("routines", userId.toHexString(), 120, 3600);

const itemSchema = z.object({
  exerciseId: z.string().min(1).max(20),
  sets: z.coerce.number().int().min(1).max(20),
  reps: z.string().trim().min(1, "target").max(20),
  weight: z.coerce.number().min(0).max(1000).nullable(),
  restSec: z.coerce.number().int().min(0).max(600),
});

const routineSchema = z.object({
  name: z.string().trim().min(2, "routineName").max(60),
  category: z.string().trim().max(20),
  notes: z.string().trim().max(300).optional(),
  items: z.array(itemSchema).min(1, "addExercise").max(30),
});

export type RoutineInputPayload = z.input<typeof routineSchema>;

export async function saveRoutineAction(payload: RoutineInputPayload, id?: string): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  const parsed = routineSchema.safeParse(payload);
  if (!parsed.success) return invalid(parsed.error, "checkRoutine");
  if (!(await underLimit(user._id))) return fail("tooManyAttempts");
  const routineId = id ? toObjectId(id) : null;
  if (id && !routineId) return fail("routineNotFound");
  try {
    const saved = await saveRoutine(user._id, parsed.data, routineId ?? undefined);
    revalidatePath("/app/routines");
    return { ok: true, data: { id: saved.toHexString() } };
  } catch (error) {
    if (error instanceof RoutineError) return fail(error.key, error.values);
    throw error;
  }
}

export async function copyTemplateAction(templateId: string) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=%2Fapp%2Froutines");
  if (!(await underLimit(user._id))) redirect("/app/routines");
  const id = await copyTemplate(user._id, templateId);
  revalidatePath("/app/routines");
  redirect(`/app/routines/${id.toHexString()}/edit?from=template`);
}

export async function deleteRoutineAction(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  const routineId = toObjectId(id);
  if (!user || !routineId) return fail("routineNotFound");
  await deleteRoutine(user._id, routineId);
  revalidatePath("/app/routines");
  return { ok: true };
}

export async function favoriteRoutineAction(id: string, favorite: boolean): Promise<ActionResult> {
  const user = await getSessionUser();
  const routineId = toObjectId(id);
  if (!user || !routineId) return fail("routineNotFound");
  await setFavorite(user._id, routineId, favorite);
  revalidatePath("/app/routines");
  return { ok: true };
}

const workoutSchema = z.object({
  routineId: z.string().nullable(),
  startedAt: z.string().datetime(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1).max(20),
        sets: z.array(z.object({ reps: z.number().int().min(0).max(10000), weight: z.number().min(0).max(1000).nullable(), done: z.boolean() })).max(30),
      }),
    )
    .max(30),
});

export async function finishWorkoutAction(payload: z.input<typeof workoutSchema>): Promise<ActionResult<{ id: string }>> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  const parsed = workoutSchema.safeParse(payload);
  if (!parsed.success) return fail("workoutUnreadable");
  if (!(await underLimit(user._id))) return fail("tooManyAttempts");
  try {
    const id = await logWorkout(user._id, {
      routineId: toObjectId(parsed.data.routineId),
      startedAt: new Date(parsed.data.startedAt),
      exercises: parsed.data.exercises,
    });
    revalidatePath("/app/routines");
    revalidatePath("/app/dashboard");
    return { ok: true, data: { id: id.toHexString() } };
  } catch (error) {
    if (error instanceof RoutineError) return fail(error.key, error.values);
    throw error;
  }
}
