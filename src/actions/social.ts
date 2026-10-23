"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult, CommentView, PostView } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { copyRoutineFromPost, RoutineError } from "@/server/modules/routines";
import {
  addComment,
  createTextPost,
  deleteComment,
  deletePost,
  feed,
  follow,
  listComments,
  reportPost,
  shareRoutine,
  shareWorkout,
  SocialError,
  toggleLike,
  unfollow,
  updateSocialProfile,
} from "@/server/modules/social";
import { done, fail } from "./utils";
import { AppError } from "@/server/errors";

type Handler<T> = () => Promise<ActionResult<T>>;

/** Shared auth + error mapping so each action stays a one-liner */
async function run<T>(fn: Handler<T>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AppError) return fail(error.key, error.values);
    throw error;
  }
}

async function requireMember() {
  const user = await getSessionUser();
  if (!user) throw new SocialError("signInAgain");
  return user;
}

function idOrThrow(id: string, what: "postNotFound" | "workoutNotFound" | "routineNotFound" | "commentNotFound" | "personNotFound" = "postNotFound") {
  const oid = toObjectId(id);
  if (!oid) throw new SocialError(what);
  return oid;
}

export async function createPostAction(input: { text: string; imageUrl?: string }): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    await createTextPost(user, { text: String(input.text ?? ""), imageUrl: input.imageUrl || undefined });
    revalidatePath("/app/social");
    return { ok: true };
  });
}

export async function shareWorkoutAction(workoutId: string, text: string): Promise<ActionResult<{ postId: string }>> {
  return run(async () => {
    const user = await requireMember();
    const postId = await shareWorkout(user, idOrThrow(workoutId, "workoutNotFound"), String(text ?? ""));
    revalidatePath("/app/social");
    return { ok: true, data: { postId: postId.toHexString() } };
  });
}

export async function shareRoutineAction(routineId: string, text: string): Promise<ActionResult<{ postId: string }>> {
  return run(async () => {
    const user = await requireMember();
    const postId = await shareRoutine(user, idOrThrow(routineId, "routineNotFound"), String(text ?? ""));
    revalidatePath("/app/social");
    return { ok: true, data: { postId: postId.toHexString() } };
  });
}

export async function saveRoutineFromPostAction(postId: string): Promise<ActionResult<{ routineId: string }>> {
  return run(async () => {
    const user = await requireMember();
    const routineId = await copyRoutineFromPost(user._id, idOrThrow(postId));
    revalidatePath("/app/routines");
    return done("savedToRoutines", undefined, { data: { routineId: routineId.toHexString() } });
  });
}

export async function deletePostAction(postId: string): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    await deletePost(user._id, idOrThrow(postId));
    revalidatePath("/app/social");
    return { ok: true };
  });
}

export async function reportPostAction(postId: string, reason: string): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    await reportPost(user._id, idOrThrow(postId), String(reason ?? ""));
    return done("reportThanks");
  });
}

export async function toggleLikeAction(postId: string): Promise<ActionResult<{ liked: boolean; likeCount: number }>> {
  return run(async () => {
    const user = await requireMember();
    return { ok: true, data: await toggleLike(user, idOrThrow(postId)) };
  });
}

export async function commentsAction(postId: string): Promise<ActionResult<CommentView[]>> {
  return run(async () => {
    const user = await requireMember();
    return { ok: true, data: await listComments(user._id, idOrThrow(postId)) };
  });
}

export async function addCommentAction(postId: string, text: string): Promise<ActionResult<CommentView[]>> {
  return run(async () => {
    const user = await requireMember();
    const id = idOrThrow(postId);
    await addComment(user, id, String(text ?? ""));
    return { ok: true, data: await listComments(user._id, id) };
  });
}

export async function deleteCommentAction(commentId: string): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    await deleteComment(user._id, idOrThrow(commentId, "commentNotFound"));
    return { ok: true };
  });
}

export async function followAction(userId: string, on: boolean): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    const target = idOrThrow(userId, "personNotFound");
    if (on) await follow(user, target);
    else await unfollow(user._id, target);
    revalidatePath("/app/social", "layout");
    return { ok: true };
  });
}

export async function loadMoreFeedAction(mode: "following" | "discover", before: string): Promise<ActionResult<PostView[]>> {
  return run(async () => {
    const user = await requireMember();
    const date = new Date(before);
    if (Number.isNaN(date.getTime())) throw new SocialError("badRequest");
    return { ok: true, data: await feed(user._id, mode === "discover" ? "discover" : "following", date) };
  });
}

const socialProfileSchema = z.object({
  handle: z.string().trim().min(3).max(25),
  bio: z.string().max(160),
  visibility: z.enum(["public", "followers"]),
  shareCheckins: z.boolean(),
});

export async function updateSocialProfileAction(input: z.input<typeof socialProfileSchema>): Promise<ActionResult> {
  return run(async () => {
    const user = await requireMember();
    const parsed = socialProfileSchema.safeParse(input);
    if (!parsed.success) throw new SocialError("handleRules");
    await updateSocialProfile(user._id, parsed.data);
    revalidatePath("/app/social", "layout");
    return done("socialSaved");
  });
}
