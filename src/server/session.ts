import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { auth, updateSession } from "@/lib/auth";
import type { ObjectId } from "mongodb";
import { collections, toObjectId } from "@/server/db/collections";
import type { GymDoc, UserDoc } from "@/server/db/models";
import { gymsManagedBy } from "@/server/modules/gyms";
import { cookies } from "next/headers";
import { findRegion, REGION_COOKIE } from "@/lib/i18n/regions";
import { env } from "@/server/env";

/** The signed-in user's database record, read once per request */
export const getSessionUser = cache(async (): Promise<UserDoc | null> => {
  const session = await auth();
  const id = toObjectId(session?.user?.id);
  if (!id) return null;
  const users = await collections.users();
  const user = await users.findOne({ _id: id });
  if (!user) return null;
  // Signed out remotely (password change or "sign out other devices")
  const authAt = (session as { authAt?: number } | null)?.authAt ?? 0;
  if (user.sessionsValidFrom && authAt < user.sessionsValidFrom.getTime()) return null;
  if (user.suspendedAt) return null;
  await rememberRegion(user);
  return user;
});

/** Ends every other signed-in device; this one stays signed in */
export async function endOtherSessions(userId: ObjectId) {
  const now = Date.now();
  await updateSession({ authAt: now } as never);
  await (await collections.users()).updateOne({ _id: userId }, { $set: { sessionsValidFrom: new Date(now) } });
}

/** Keeps the account's region in step with the switcher, so pushes and emails use the same language */
async function rememberRegion(user: UserDoc) {
  // Only an explicit choice counts; a browser-language guess shouldn't overwrite the saved one
  const region = findRegion((await cookies()).get(REGION_COOKIE)?.value);
  if (!region || user.regionCode === region.code) return;
  user.regionCode = region.code;
  const users = await collections.users();
  await users.updateOne({ _id: user._id }, { $set: { regionCode: region.code } });
}

/** For pages: sends signed-out visitors to the login page and back afterwards */
export async function requireUser(returnTo: string): Promise<UserDoc> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Platform staff: the admin role, or an email listed in ADMIN_EMAILS */
export function isAdmin(user: UserDoc | null): user is UserDoc {
  if (!user) return false;
  return Boolean(user.roles?.includes("admin") || (user.email && env.adminEmails.includes(user.email.toLowerCase())));
}

/** For admin pages and actions: anyone else gets a plain 404, so the console doesn't advertise itself */
export async function requireAdmin(): Promise<UserDoc> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) notFound();
  return user;
}

export interface OwnerContext {
  user: UserDoc;
  gyms: GymDoc[];
  gym: GymDoc;
}

export const getOwnerContext = cache(async (): Promise<{ user: UserDoc | null; gyms: GymDoc[] }> => {
  const user = await getSessionUser();
  if (!user) return { user: null, gyms: [] };
  return { user, gyms: await gymsManagedBy(user._id) };
});

/** For studio pages: needs a signed-in user who runs at least one gym */
export async function requireOwner(returnTo = "/studio/dashboard"): Promise<OwnerContext> {
  const { user, gyms } = await getOwnerContext();
  if (!user) redirect(`/studio/login?next=${encodeURIComponent(returnTo)}`);
  if (gyms.length === 0) redirect("/studio/onboarding");
  return { user, gyms, gym: gyms[0] };
}

export { initials } from "@/lib/initials";
