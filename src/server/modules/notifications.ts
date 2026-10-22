import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { NotificationDoc, NotificationType } from "@/server/db/models";
import type { NotificationView } from "@/lib/types";
import { push } from "@/server/services/push";

export interface NotifyInput {
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  /** Skip the device push and only write to the in-app feed */
  silent?: boolean;
}

export function toNotificationView(doc: NotificationDoc): NotificationView {
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    title: doc.title,
    body: doc.body,
    link: doc.link ?? null,
    read: doc.read,
    createdAt: doc.createdAt.toISOString(),
  };
}

/**
 * Writes an in-app notification and pushes it to every device the user has
 * registered. Push failures never fail the caller.
 */
export async function notify(userId: ObjectId, input: NotifyInput) {
  const notifications = await collections.notifications();
  await notifications.insertOne({
    _id: new ObjectId(),
    userId,
    type: input.type,
    title: input.title,
    body: input.body,
    link: input.link,
    read: false,
    createdAt: new Date(),
  });

  if (input.silent) return;

  try {
    const users = await collections.users();
    const user = await users.findOne({ _id: userId }, { projection: { notificationPrefs: 1 } });
    if (user?.notificationPrefs && user.notificationPrefs.push === false) return;

    const tokensCol = await collections.pushTokens();
    const tokens = (await tokensCol.find({ userId }).toArray()).map((t) => t.token);
    if (tokens.length === 0) return;

    const result = await push().send(tokens, { title: input.title, body: input.body, link: input.link, tag: input.type });
    if (result.invalidTokens.length > 0) {
      await tokensCol.deleteMany({ token: { $in: result.invalidTokens } });
    }
  } catch (error) {
    console.error("[notify] push failed", error);
  }
}

export async function listNotifications(userId: ObjectId, limit = 50) {
  const notifications = await collections.notifications();
  const docs = await notifications.find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray();
  return docs.map(toNotificationView);
}

export async function unreadCount(userId: ObjectId) {
  const notifications = await collections.notifications();
  return notifications.countDocuments({ userId, read: false });
}

export async function markRead(userId: ObjectId, ids: ObjectId[] | "all") {
  const notifications = await collections.notifications();
  await notifications.updateMany(ids === "all" ? { userId, read: false } : { userId, _id: { $in: ids } }, { $set: { read: true } });
}

export async function registerPushToken(userId: ObjectId, token: string, userAgent?: string) {
  const tokens = await collections.pushTokens();
  const now = new Date();
  // A browser token belongs to whoever signed in on it last
  await tokens.updateOne(
    { token },
    { $set: { userId, userAgent, lastSeenAt: now }, $setOnInsert: { _id: new ObjectId(), token, createdAt: now } },
    { upsert: true },
  );
}

export async function removePushToken(userId: ObjectId, token: string) {
  const tokens = await collections.pushTokens();
  await tokens.deleteOne({ userId, token });
}
