import "server-only";
import { AppError } from "@/server/errors";
import { ObjectId, type Filter } from "mongodb";
import { collections } from "@/server/db/collections";
import type { PostDoc, SocialPrefs, UserDoc } from "@/server/db/models";
import type { CommentView, PersonView, PostView } from "@/lib/types";
import { initials } from "@/lib/initials";
import { notify } from "./notifications";
import { ownedUploads } from "./media";
import { literalPattern } from "@/server/db/search";

export class SocialError extends AppError {}

export const defaultSocialPrefs: SocialPrefs = { visibility: "public", shareCheckins: false };

const HANDLE_RE = /^[a-z0-9_.]{3,24}$/;

export function socialPrefsOf(user: Pick<UserDoc, "social">): SocialPrefs {
  return { ...defaultSocialPrefs, ...user.social };
}

function slugHandle(name: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return base.length >= 3 ? base : `athlete${base}`;
}

/** Gives a user a unique @handle the first time they touch the social side */
export async function ensureHandle(user: UserDoc): Promise<string> {
  if (user.handle) return user.handle;
  const users = await collections.users();
  const base = slugHandle(user.name || user.email?.split("@")[0] || "athlete");
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = attempt === 0 ? base : `${base}${Math.floor(Math.random() * 9000 + 1000)}`;
    try {
      const res = await users.updateOne({ _id: user._id, handle: { $exists: false } }, { $set: { handle: candidate } });
      if (res.modifiedCount === 1) return candidate;
      const fresh = await users.findOne({ _id: user._id }, { projection: { handle: 1 } });
      if (fresh?.handle) return fresh.handle;
    } catch (error) {
      if ((error as { code?: number }).code !== 11000) throw error; // duplicate handle: try another
    }
  }
  throw new SocialError("handleFailed");
}

export async function updateSocialProfile(userId: ObjectId, input: { handle: string; bio: string; visibility: SocialPrefs["visibility"]; shareCheckins: boolean }) {
  const handle = input.handle.trim().toLowerCase().replace(/^@/, "");
  if (!HANDLE_RE.test(handle)) throw new SocialError("handleRules");
  const users = await collections.users();
  try {
    await users.updateOne(
      { _id: userId },
      { $set: { handle, bio: input.bio.trim().slice(0, 160), social: { visibility: input.visibility, shareCheckins: input.shareCheckins }, updatedAt: new Date() } },
    );
  } catch (error) {
    if ((error as { code?: number }).code === 11000) throw new SocialError("handleTaken");
    throw error;
  }
  // Older posts follow the new visibility, so going private hides past activity too
  await (await collections.posts()).updateMany({ userId }, { $set: { visibility: input.visibility } });
}

function toAuthor(user: Pick<UserDoc, "_id" | "name" | "handle" | "image">) {
  const name = user.name || "Fit Planet member";
  return { id: user._id.toHexString(), name, handle: user.handle ?? "", image: user.image ?? null, initials: initials(name) };
}

async function followingIds(viewerId: ObjectId) {
  const follows = await (await collections.follows()).find({ followerId: viewerId }, { projection: { followeeId: 1 } }).toArray();
  return follows.map((f) => f.followeeId);
}

/** Posts the viewer may see: their own, public ones, and followers-only posts of people they follow */
function visibleFilter(viewerId: ObjectId, following: ObjectId[]): Filter<PostDoc> {
  return { $or: [{ userId: viewerId }, { visibility: "public" }, { visibility: "followers", userId: { $in: following } }] };
}

async function hydratePosts(docs: PostDoc[], viewerId: ObjectId): Promise<PostView[]> {
  if (docs.length === 0) return [];
  const users = await collections.users();
  const authors = await users
    .find({ _id: { $in: [...new Set(docs.map((d) => d.userId.toHexString()))].map((id) => new ObjectId(id)) } }, { projection: { name: 1, handle: 1, image: 1 } })
    .toArray();
  const byId = new Map(authors.map((a) => [a._id.toHexString(), a]));
  const liked = new Set(
    (await (await collections.likes()).find({ userId: viewerId, postId: { $in: docs.map((d) => d._id) } }, { projection: { postId: 1 } }).toArray()).map((l) =>
      l.postId.toHexString(),
    ),
  );
  return docs.flatMap((d) => {
    const author = byId.get(d.userId.toHexString());
    if (!author) return [];
    return [
      {
        id: d._id.toHexString(),
        kind: d.kind,
        text: d.text ?? "",
        imageUrl: d.imageUrl ?? null,
        createdAt: d.createdAt.toISOString(),
        author: toAuthor(author),
        workout: d.workout ? { ...d.workout, id: d.workout.id.toHexString() } : null,
        checkin: d.checkin ? { gymName: d.checkin.gymName, gymSlug: d.checkin.gymSlug, city: d.checkin.city } : null,
        routine: d.routine ? { ...d.routine, id: d.routine.id.toHexString() } : null,
        visibility: d.visibility,
        likeCount: d.likeCount,
        commentCount: d.commentCount,
        liked: liked.has(d._id.toHexString()),
        mine: d.userId.equals(viewerId),
      },
    ];
  });
}

export async function feed(viewerId: ObjectId, mode: "following" | "discover", before?: Date, limit = 20) {
  const following = await followingIds(viewerId);
  const posts = await collections.posts();
  const scope: Filter<PostDoc> = mode === "following" ? { userId: { $in: [viewerId, ...following] } } : { visibility: "public" };
  const docs = await posts
    .find({ $and: [scope, visibleFilter(viewerId, following), ...(before ? [{ createdAt: { $lt: before } }] : [])] })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return hydratePosts(docs, viewerId);
}

export async function postsBy(viewerId: ObjectId, authorId: ObjectId, limit = 30) {
  const following = await followingIds(viewerId);
  const docs = await (await collections.posts())
    .find({ $and: [{ userId: authorId }, visibleFilter(viewerId, following)] })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return hydratePosts(docs, viewerId);
}

async function canSee(viewerId: ObjectId, post: PostDoc) {
  if (post.visibility === "public" || post.userId.equals(viewerId)) return true;
  return Boolean(await (await collections.follows()).findOne({ followerId: viewerId, followeeId: post.userId }));
}

async function insertPost(user: UserDoc, post: Omit<PostDoc, "_id" | "userId" | "visibility" | "likeCount" | "commentCount" | "createdAt">) {
  await ensureHandle(user);
  const doc: PostDoc = {
    _id: new ObjectId(),
    userId: user._id,
    visibility: socialPrefsOf(user).visibility,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
    ...post,
  };
  await (await collections.posts()).insertOne(doc);
  return doc._id;
}

export async function createTextPost(user: UserDoc, input: { text: string; imageUrl?: string }) {
  const text = input.text.trim();
  if (!text && !input.imageUrl) throw new SocialError("emptyPost");
  // Only images we stored ourselves can be attached
  if (input.imageUrl) {
    const own = input.imageUrl.includes(`/posts/${user._id.toHexString()}/`) && (await ownedUploads(user._id, [input.imageUrl])).has(input.imageUrl);
    if (!own) throw new SocialError("photoNotAllowed");
  }
  return insertPost(user, { kind: "text", text: text.slice(0, 1000), imageUrl: input.imageUrl });
}

export async function shareWorkout(user: UserDoc, workoutId: ObjectId, text: string) {
  const workout = await (await collections.workouts()).findOne({ _id: workoutId, userId: user._id });
  if (!workout) throw new SocialError("workoutNotFound");
  const existing = await (await collections.posts()).findOne({ userId: user._id, "workout.id": workoutId }, { projection: { _id: 1 } });
  if (existing) return existing._id;
  return insertPost(user, {
    kind: "workout",
    text: text.trim().slice(0, 1000),
    workout: {
      id: workout._id,
      routineName: workout.routineName,
      durationMin: workout.durationMin,
      setsDone: workout.setsDone,
      volumeKg: workout.volumeKg,
      exerciseIds: workout.exercises.filter((e) => e.sets.some((s) => s.done)).map((e) => e.exerciseId),
    },
  });
}

export async function shareRoutine(user: UserDoc, routineId: ObjectId, text: string) {
  const routine = await (await collections.routines()).findOne({ _id: routineId, userId: user._id });
  if (!routine) throw new SocialError("routineNotFound");
  return insertPost(user, {
    kind: "routine",
    text: text.trim().slice(0, 1000),
    routine: { id: routine._id, name: routine.name, category: routine.category, items: routine.items },
  });
}

/** Called after a successful gym check-in; posts only if the member opted in */
export async function maybeShareCheckin(userId: ObjectId, gym: { _id: ObjectId; name: string; slug: string; address: { city: string } }) {
  const user = await (await collections.users()).findOne({ _id: userId });
  if (!user || !socialPrefsOf(user).shareCheckins) return;
  // One check-in post per gym per day is plenty
  const since = new Date(Date.now() - 20 * 3600_000);
  const recent = await (await collections.posts()).findOne({ userId, kind: "checkin", "checkin.gymId": gym._id, createdAt: { $gte: since } });
  if (recent) return;
  await insertPost(user, { kind: "checkin", checkin: { gymId: gym._id, gymName: gym.name, gymSlug: gym.slug, city: gym.address.city } });
}

export async function deletePost(userId: ObjectId, postId: ObjectId) {
  const res = await (await collections.posts()).deleteOne({ _id: postId, userId });
  if (res.deletedCount) {
    await Promise.all([(await collections.likes()).deleteMany({ postId }), (await collections.comments()).deleteMany({ postId })]);
  }
}

export async function reportPost(userId: ObjectId, postId: ObjectId, reason: string) {
  const post = await (await collections.posts()).findOne({ _id: postId }, { projection: { userId: 1, visibility: 1 } });
  if (!post || post.userId.equals(userId) || !(await canSee(userId, post))) throw new SocialError("postNotFound");
  // One report per person per post, so a single account can't push a post up the queue
  await (await collections.reports()).updateOne(
    { postId, reporterId: userId },
    { $set: { reason: reason.slice(0, 300), createdAt: new Date() }, $setOnInsert: { _id: new ObjectId() } },
    { upsert: true },
  );
}

export async function toggleLike(user: UserDoc, postId: ObjectId) {
  const posts = await collections.posts();
  const post = await posts.findOne({ _id: postId });
  if (!post || !(await canSee(user._id, post))) throw new SocialError("postNotFound");
  const likes = await collections.likes();
  const removed = await likes.deleteOne({ postId, userId: user._id });
  if (removed.deletedCount) {
    await posts.updateOne({ _id: postId }, { $inc: { likeCount: -1 } });
    return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
  }
  try {
    await likes.insertOne({ _id: new ObjectId(), postId, userId: user._id, createdAt: new Date() });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return { liked: true, likeCount: post.likeCount };
    throw error;
  }
  await posts.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
  if (!post.userId.equals(user._id)) {
    await notify(post.userId, {
      type: "social.like",
      key: "socialLike",
      params: { name: user.name || "", text: post.text?.slice(0, 80) || postSubject(post) },
      link: `/app/social/post/${postId.toHexString()}`,
      silent: true,
    });
  }
  return { liked: true, likeCount: post.likeCount + 1 };
}

function postSubject(post: PostDoc) {
  if (post.workout) return post.workout.routineName;
  if (post.checkin) return post.checkin.gymName;
  if (post.routine) return post.routine.name;
  return "";
}

export async function getPost(viewerId: ObjectId, postId: ObjectId) {
  const post = await (await collections.posts()).findOne({ _id: postId });
  if (!post || !(await canSee(viewerId, post))) return null;
  return (await hydratePosts([post], viewerId))[0] ?? null;
}

export async function listComments(viewerId: ObjectId, postId: ObjectId): Promise<CommentView[]> {
  const post = await (await collections.posts()).findOne({ _id: postId });
  if (!post || !(await canSee(viewerId, post))) return [];
  const docs = await (await collections.comments()).find({ postId }).sort({ createdAt: 1 }).limit(200).toArray();
  const authors = await (await collections.users())
    .find({ _id: { $in: docs.map((c) => c.userId) } }, { projection: { name: 1, handle: 1, image: 1 } })
    .toArray();
  const byId = new Map(authors.map((a) => [a._id.toHexString(), a]));
  return docs.flatMap((c) => {
    const author = byId.get(c.userId.toHexString());
    return author ? [{ id: c._id.toHexString(), text: c.text, createdAt: c.createdAt.toISOString(), author: toAuthor(author), mine: c.userId.equals(viewerId) }] : [];
  });
}

export async function addComment(user: UserDoc, postId: ObjectId, text: string) {
  const clean = text.trim();
  if (!clean) throw new SocialError("writeComment");
  const posts = await collections.posts();
  const post = await posts.findOne({ _id: postId });
  if (!post || !(await canSee(user._id, post))) throw new SocialError("postNotFound");
  await ensureHandle(user);
  const doc = { _id: new ObjectId(), postId, userId: user._id, text: clean.slice(0, 500), createdAt: new Date() };
  await (await collections.comments()).insertOne(doc);
  await posts.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });
  if (!post.userId.equals(user._id)) {
    await notify(post.userId, {
      type: "social.comment",
      key: "socialComment",
      params: { name: user.name || "", text: clean.slice(0, 100) },
      link: `/app/social/post/${postId.toHexString()}`,
    });
  }
  return doc._id;
}

export async function deleteComment(userId: ObjectId, commentId: ObjectId) {
  const comments = await collections.comments();
  const comment = await comments.findOne({ _id: commentId });
  if (!comment) return;
  // Authors can delete their comments; post owners can remove comments on their posts
  const post = await (await collections.posts()).findOne({ _id: comment.postId }, { projection: { userId: 1 } });
  if (!comment.userId.equals(userId) && !post?.userId.equals(userId)) throw new SocialError("cannotDeleteComment");
  await comments.deleteOne({ _id: commentId });
  await (await collections.posts()).updateOne({ _id: comment.postId }, { $inc: { commentCount: -1 } });
}

export async function follow(user: UserDoc, targetId: ObjectId) {
  if (user._id.equals(targetId)) throw new SocialError("cannotFollowSelf");
  const target = await (await collections.users()).findOne({ _id: targetId }, { projection: { _id: 1 } });
  if (!target) throw new SocialError("personNotFound");
  await ensureHandle(user);
  try {
    await (await collections.follows()).insertOne({ _id: new ObjectId(), followerId: user._id, followeeId: targetId, createdAt: new Date() });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return;
    throw error;
  }
  await notify(targetId, {
    type: "social.follow",
    key: "socialFollow",
    params: { name: user.name || "" },
    link: user.handle ? `/app/u/${user.handle}` : "/app/social/people",
  });
}

export async function unfollow(userId: ObjectId, targetId: ObjectId) {
  await (await collections.follows()).deleteOne({ followerId: userId, followeeId: targetId });
}

async function toPeople(viewerId: ObjectId, docs: UserDoc[]): Promise<PersonView[]> {
  const following = new Set((await followingIds(viewerId)).map((id) => id.toHexString()));
  return docs.map((u) => ({
    ...toAuthor(u),
    bio: u.bio ?? "",
    following: following.has(u._id.toHexString()),
    isSelf: u._id.equals(viewerId),
  }));
}

const personProjection = { name: 1, handle: 1, image: 1, bio: 1 } as const;

export async function searchPeople(viewerId: ObjectId, query: string) {
  const q = query.trim().replace(/^@/, "");
  if (q.length < 2) return [];
  const escaped = literalPattern(q);
  const docs = await (await collections.users())
    .find({ handle: { $exists: true }, $or: [{ handle: { $regex: `^${escaped.toLowerCase()}` } }, { name: { $regex: escaped, $options: "i" } }] }, { projection: personProjection })
    .limit(20)
    .toArray();
  return toPeople(viewerId, docs as UserDoc[]);
}

/** People who train at the same gyms first, then the most active members */
export async function suggestedPeople(viewerId: ObjectId, limit = 8) {
  const exclude = [viewerId, ...(await followingIds(viewerId))];
  const checkins = await collections.checkins();
  const myGyms = await checkins.distinct("gymId", { userId: viewerId });
  const gymmates = myGyms.length ? await checkins.distinct("userId", { gymId: { $in: myGyms }, userId: { $nin: exclude } }) : [];
  const recentPosters = await (await collections.posts()).distinct("userId", { visibility: "public", userId: { $nin: exclude } });
  const users = await collections.users();
  // Only people with a social profile; gym-mates rank ahead of active posters
  const [mates, posters] = await Promise.all([
    gymmates.length ? users.find({ _id: { $in: gymmates }, handle: { $exists: true } }, { projection: personProjection }).limit(limit).toArray() : [],
    users.find({ _id: { $in: recentPosters }, handle: { $exists: true } }, { projection: personProjection }).limit(limit).toArray(),
  ]);
  const seen = new Set<string>();
  const docs = [...mates, ...posters].filter((u) => !seen.has(u._id.toHexString()) && seen.add(u._id.toHexString())).slice(0, limit);
  return toPeople(viewerId, docs as UserDoc[]);
}

export async function profileByHandle(viewerId: ObjectId, handle: string) {
  const user = await (await collections.users()).findOne({ handle: handle.toLowerCase() }, { projection: personProjection });
  if (!user) return null;
  const [person] = await toPeople(viewerId, [user as UserDoc]);
  const follows = await collections.follows();
  const [followers, followingCount, workouts] = await Promise.all([
    follows.countDocuments({ followeeId: user._id }),
    follows.countDocuments({ followerId: user._id }),
    (await collections.workouts()).countDocuments({ userId: user._id }),
  ]);
  return { person, userId: user._id, stats: { followers, following: followingCount, workouts } };
}

export async function socialCounts(userId: ObjectId) {
  const follows = await collections.follows();
  const [followers, following] = await Promise.all([follows.countDocuments({ followeeId: userId }), follows.countDocuments({ followerId: userId })]);
  return { followers, following };
}
