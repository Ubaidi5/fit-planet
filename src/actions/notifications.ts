"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult, NotificationView } from "@/lib/types";
import { toObjectId } from "@/server/db/collections";
import { getSessionUser } from "@/server/session";
import { listNotifications, markRead, registerPushToken, removePushToken, unreadCount } from "@/server/modules/notifications";
import { fail } from "./utils";
import { allow } from "@/server/rate-limit";

export async function registerPushTokenAction(token: string, userAgent?: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  if (typeof token !== "string" || !token || token.length > 4096) return fail("badRequest");
  if (!(await allow("push-token", user._id.toHexString(), 30, 3600))) return fail("tooManyAttempts");
  await registerPushToken(user._id, token, userAgent?.slice(0, 300));
  return { ok: true };
}

export async function removePushTokenAction(token: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  await removePushToken(user._id, token);
  return { ok: true };
}

/** Polled by the bell so new bookings show up without a refresh */
export async function notificationFeedAction(): Promise<{ unread: number; items: NotificationView[] }> {
  const user = await getSessionUser();
  if (!user) return { unread: 0, items: [] };
  const [unread, items] = await Promise.all([unreadCount(user._id), listNotifications(user._id, 20)]);
  return { unread, items };
}

export async function markNotificationsReadAction(ids: string[] | "all"): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  const parsed = ids === "all" ? "all" : ids.map(toObjectId).filter((id): id is NonNullable<typeof id> => id !== null);
  await markRead(user._id, parsed);
  revalidatePath("/app/notifications");
  revalidatePath("/studio/notifications");
  return { ok: true };
}
