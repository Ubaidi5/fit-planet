import "server-only";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import type { NotificationDoc, NotificationParams, NotificationType } from "@/server/db/models";
import type { NotificationView } from "@/lib/types";
import { push } from "@/server/services/push";
import { getRegion } from "@/lib/i18n/server";
import { formatMoney } from "@/lib/i18n/format";
import type { Region } from "@/lib/i18n/regions";
import { formatDate } from "@/lib/dates";
import { translatorFor, type Translate } from "@/server/i18n";

export type NotificationKey =
  | "bookingNew"
  | "bookingConfirmed"
  | "bookingCancelledByMember"
  | "bookingCancelledByGym"
  | "passStarts"
  | "passEnds"
  | "reviewNew"
  | "reviewReply"
  | "socialLike"
  | "socialComment"
  | "socialFollow"
  | "checkin"
  | "checkinStamp"
  | "studioReady"
  | "gymVerified"
  | "gymSuspended"
  | "gymRestored"
  | "postRemoved"
  | "staffJoined";

export interface NotifyInput {
  type: NotificationType;
  key: NotificationKey;
  params?: NotificationParams;
  link?: string;
  /** Skip the device push and only write to the in-app feed */
  silent?: boolean;
}

/** Turns stored values into display strings for the reader's locale */
function displayParams(params: NotificationParams, t: Translate, region: Region) {
  const out: Record<string, string | number> = { ...params };
  const day = (iso: string) => formatDate(iso, region.locale, { weekday: "short", day: "numeric", month: "short" });
  if (typeof params.startDate === "string") {
    out.startDate = day(params.startDate);
    out.dates =
      typeof params.endDate === "string" && params.endDate !== params.startDate
        ? t("range", { from: formatDate(params.startDate, region.locale), to: formatDate(params.endDate, region.locale) })
        : out.startDate;
  }
  if (typeof params.amount === "number" && typeof params.currency === "string") {
    out.price = formatMoney(params.amount, params.currency, region.locale);
  }
  if (params.name === "") out.name = t("someone");
  if (params.text === "") out.text = t("yourPost");
  if (params.gym === "") out.gym = t("theGym");
  return out;
}

function render(t: Translate, region: Region, key: string, params: NotificationParams = {}) {
  const values = displayParams(params, t, region);
  return { title: t(`${key}.title`, values), body: t(`${key}.body`, values) };
}

function toView(doc: NotificationDoc, t: Translate, region: Region): NotificationView {
  const text = doc.key ? render(t, region, doc.key, doc.params) : { title: doc.title, body: doc.body };
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    title: text.title,
    body: text.body,
    link: doc.link ?? null,
    read: doc.read,
    createdAt: doc.createdAt.toISOString(),
  };
}

/**
 * Writes an in-app notification and pushes it to every device the user has
 * registered, in the language saved on their account. Push failures never
 * fail the caller.
 */
export async function notify(userId: ObjectId, input: NotifyInput) {
  const english = await translatorFor("INTL", "notify");
  const snapshot = render(english.t, english.region, input.key, input.params);
  const notifications = await collections.notifications();
  await notifications.insertOne({
    _id: new ObjectId(),
    userId,
    type: input.type,
    key: input.key,
    params: input.params,
    title: snapshot.title,
    body: snapshot.body,
    link: input.link,
    read: false,
    createdAt: new Date(),
  });

  if (input.silent) return;

  try {
    const users = await collections.users();
    const user = await users.findOne({ _id: userId }, { projection: { notificationPrefs: 1, regionCode: 1 } });
    if (user?.notificationPrefs && user.notificationPrefs.push === false) return;

    const tokensCol = await collections.pushTokens();
    const tokens = (await tokensCol.find({ userId }).toArray()).map((t) => t.token);
    if (tokens.length === 0) return;

    const { t, region } = await translatorFor(user?.regionCode, "notify");
    const text = render(t, region, input.key, input.params);
    const result = await push().send(tokens, { title: text.title, body: text.body, link: input.link, tag: input.type });
    if (result.invalidTokens.length > 0) {
      await tokensCol.deleteMany({ token: { $in: result.invalidTokens } });
    }
  } catch (error) {
    console.error("[notify] push failed", error);
  }
}

export async function listNotifications(userId: ObjectId, limit = 50) {
  const notifications = await collections.notifications();
  const [docs, viewer] = await Promise.all([
    notifications.find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray(),
    getRegion(),
  ]);
  const { t, region } = await translatorFor(viewer.code, "notify");
  return docs.map((doc) => toView(doc, t, region));
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
