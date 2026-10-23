import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { RoutineDoc, RoutineItemDoc, WorkoutDoc } from "@/server/db/models";
import type { RoutineView, WorkoutView } from "@/lib/types";
import { exerciseById, isTimed, routineTemplates } from "@/lib/data/exercises";

export class RoutineError extends Error {}

export function toRoutineView(doc: RoutineDoc): RoutineView {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    category: doc.category,
    notes: doc.notes ?? "",
    items: doc.items,
    favorite: doc.favorite,
    timesCompleted: doc.timesCompleted,
    lastCompletedAt: doc.lastCompletedAt?.toISOString() ?? null,
  };
}

export function toWorkoutView(doc: WorkoutDoc): WorkoutView {
  return {
    id: doc._id.toHexString(),
    routineId: doc.routineId?.toHexString() ?? null,
    routineName: doc.routineName,
    startedAt: doc.startedAt.toISOString(),
    completedAt: doc.completedAt.toISOString(),
    durationMin: doc.durationMin,
    volumeKg: doc.volumeKg,
    setsDone: doc.setsDone,
    exercises: doc.exercises,
  };
}

export async function listRoutines(userId: ObjectId) {
  const routines = await collections.routines();
  const docs = await routines.find({ userId }).sort({ favorite: -1, updatedAt: -1 }).limit(100).toArray();
  return docs.map(toRoutineView);
}

export async function getRoutine(userId: ObjectId, id: ObjectId) {
  const doc = await (await collections.routines()).findOne({ _id: id, userId });
  return doc ? toRoutineView(doc) : null;
}

export interface RoutineInput {
  name: string;
  category: string;
  notes?: string;
  items: RoutineItemDoc[];
}

function cleanItems(items: RoutineItemDoc[]) {
  const valid = items.filter((i) => exerciseById.has(i.exerciseId));
  if (valid.length === 0) throw new RoutineError("Add at least one exercise.");
  return valid;
}

export async function saveRoutine(userId: ObjectId, input: RoutineInput, id?: ObjectId) {
  const routines = await collections.routines();
  const items = cleanItems(input.items);
  const now = new Date();
  if (id) {
    const res = await routines.updateOne(
      { _id: id, userId },
      { $set: { name: input.name, category: input.category, notes: input.notes, items, updatedAt: now } },
    );
    if (res.matchedCount === 0) throw new RoutineError("Routine not found.");
    return id;
  }
  const count = await routines.countDocuments({ userId });
  if (count >= 100) throw new RoutineError("You can keep up to 100 routines. Delete one to add another.");
  const doc: RoutineDoc = {
    _id: new ObjectId(),
    userId,
    name: input.name,
    category: input.category,
    notes: input.notes,
    items,
    favorite: false,
    timesCompleted: 0,
    createdAt: now,
    updatedAt: now,
  };
  await routines.insertOne(doc);
  return doc._id;
}

export async function copyTemplate(userId: ObjectId, templateId: string) {
  const template = routineTemplates.find((t) => t.id === templateId);
  if (!template) throw new RoutineError("Template not found.");
  return saveRoutine(userId, { name: template.name, category: template.category, notes: template.notes, items: template.items });
}

export async function deleteRoutine(userId: ObjectId, id: ObjectId) {
  await (await collections.routines()).deleteOne({ _id: id, userId });
}

export async function setFavorite(userId: ObjectId, id: ObjectId, favorite: boolean) {
  await (await collections.routines()).updateOne({ _id: id, userId }, { $set: { favorite } });
}

export interface WorkoutInput {
  routineId: ObjectId | null;
  startedAt: Date;
  exercises: WorkoutDoc["exercises"];
}

/** Stores a finished workout and bumps the routine's counters */
export async function logWorkout(userId: ObjectId, input: WorkoutInput) {
  const routines = await collections.routines();
  const routine = input.routineId ? await routines.findOne({ _id: input.routineId, userId }) : null;
  if (input.routineId && !routine) throw new RoutineError("Routine not found.");

  const exercises = input.exercises.filter((e) => exerciseById.has(e.exerciseId));
  let volumeKg = 0;
  let setsDone = 0;
  for (const e of exercises) {
    for (const set of e.sets) {
      if (!set.done) continue;
      setsDone++;
      if (!isTimed(e.exerciseId) && set.weight) volumeKg += set.reps * set.weight;
    }
  }
  if (setsDone === 0) throw new RoutineError("Complete at least one set before finishing.");

  const now = new Date();
  // Clamp to something sane in case the device clock or a stale draft is off
  const startedAt = input.startedAt > now || now.getTime() - input.startedAt.getTime() > 6 * 3600_000 ? now : input.startedAt;
  const doc: WorkoutDoc = {
    _id: new ObjectId(),
    userId,
    routineId: routine?._id ?? null,
    routineName: routine?.name ?? "Workout",
    startedAt,
    completedAt: now,
    durationMin: Math.max(1, Math.round((now.getTime() - startedAt.getTime()) / 60_000)),
    exercises,
    volumeKg: Math.round(volumeKg),
    setsDone,
    createdAt: now,
  };
  await (await collections.workouts()).insertOne(doc);
  if (routine) await routines.updateOne({ _id: routine._id }, { $inc: { timesCompleted: 1 }, $set: { lastCompletedAt: now } });
  return doc._id;
}

export async function recentWorkouts(userId: ObjectId, limit = 20) {
  const docs = await (await collections.workouts()).find({ userId }).sort({ completedAt: -1 }).limit(limit).toArray();
  return docs.map(toWorkoutView);
}

export async function getWorkout(userId: ObjectId, id: ObjectId) {
  const doc = await (await collections.workouts()).findOne({ _id: id, userId });
  return doc ? toWorkoutView(doc) : null;
}

/** Last logged weight per exercise, used to prefill the workout player */
export async function lastWeights(userId: ObjectId, exerciseIds: string[]) {
  const docs = await (await collections.workouts())
    .find({ userId, "exercises.exerciseId": { $in: exerciseIds } }, { projection: { exercises: 1 } })
    .sort({ completedAt: -1 })
    .limit(20)
    .toArray();
  const out: Record<string, number> = {};
  for (const w of docs) {
    for (const e of w.exercises) {
      if (out[e.exerciseId] !== undefined || !exerciseIds.includes(e.exerciseId)) continue;
      const top = Math.max(0, ...e.sets.filter((s) => s.done && s.weight).map((s) => s.weight ?? 0));
      if (top > 0) out[e.exerciseId] = top;
    }
  }
  return out;
}
