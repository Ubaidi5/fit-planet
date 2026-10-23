import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { collections, toObjectId } from "@/server/db/collections";
import type { GymDoc, UserDoc } from "@/server/db/models";
import { gymsManagedBy } from "@/server/modules/gyms";

/** The signed-in user's database record, read once per request */
export const getSessionUser = cache(async (): Promise<UserDoc | null> => {
  const session = await auth();
  const id = toObjectId(session?.user?.id);
  if (!id) return null;
  const users = await collections.users();
  return users.findOne({ _id: id });
});

/** For pages: sends signed-out visitors to the login page and back afterwards */
export async function requireUser(returnTo: string): Promise<UserDoc> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
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
