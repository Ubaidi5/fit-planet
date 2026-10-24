import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { AppError } from "@/server/errors";
import { collections } from "@/server/db/collections";
import type { GymDoc, UserDoc } from "@/server/db/models";
import { env } from "@/server/env";
import { email } from "@/server/services/email";
import { staffInviteEmail } from "@/server/services/email/templates";
import { translatorFor } from "@/server/i18n";
import { notify } from "@/server/modules/notifications";

export class TeamError extends AppError {}

const MAX_STAFF = 20;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Staff and open invites for a gym the user owns */
export async function teamOf(gym: GymDoc) {
  const [staff, invites] = await Promise.all([
    (await collections.users()).find({ _id: { $in: gym.staffIds ?? [] } }, { projection: { name: 1, email: 1, image: 1 } }).toArray(),
    (await collections.staffInvites()).find({ gymId: gym._id, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).toArray(),
  ]);
  return {
    staff: staff.map((u) => ({ id: u._id.toHexString(), name: u.name ?? "", email: u.email ?? "", image: u.image ?? null })),
    invites: invites.map((i) => ({ id: i._id.toHexString(), email: i.email, expiresAt: i.expiresAt.toISOString() })),
  };
}

/** Emails a join link that is good for seven days */
export async function inviteStaff(owner: UserDoc, gym: GymDoc, address: string) {
  const target = address.trim().toLowerCase();
  if (target === owner.email?.toLowerCase()) throw new TeamError("inviteSelf");
  if ((gym.staffIds?.length ?? 0) >= MAX_STAFF) throw new TeamError("teamFull", { count: MAX_STAFF });
  const existing = await (await collections.users()).findOne({ email: target }, { projection: { _id: 1, regionCode: 1 } });
  if (existing && gym.staffIds?.some((id) => id.equals(existing._id))) throw new TeamError("alreadyStaff");

  const invites = await collections.staffInvites();
  await invites.deleteMany({ gymId: gym._id, email: target });
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  await invites.insertOne({
    _id: new ObjectId(),
    gymId: gym._id,
    email: target,
    tokenHash: hashToken(token),
    invitedBy: owner._id,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 7 * 86_400_000),
  });
  const url = `${env.appUrl}/studio/join?token=${token}`;
  // The invitee's language when they already have an account, otherwise the owner's
  const { t } = await translatorFor(existing?.regionCode ?? owner.regionCode, "email");
  await email().send(staffInviteEmail(target, { gym: gym.name, inviter: owner.name ?? gym.name, url }, t));
}

export async function cancelInvite(gym: GymDoc, inviteId: ObjectId) {
  await (await collections.staffInvites()).deleteOne({ _id: inviteId, gymId: gym._id });
}

export async function removeStaff(gym: GymDoc, userId: ObjectId) {
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $pull: { staffIds: userId }, $set: { updatedAt: new Date() } });
}

/** What a join link points at, for the confirmation page */
export async function inviteByToken(token: string) {
  if (typeof token !== "string" || token.length < 20) return null;
  const invite = await (await collections.staffInvites()).findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!invite) return null;
  const gym = await (await collections.gyms()).findOne({ _id: invite.gymId }, { projection: { name: 1, address: 1, ownerId: 1 } });
  return gym ? { invite, gym } : null;
}

/**
 * Accepts an invite. The signed-in account must use the invited email, so a
 * forwarded link can't be used by someone else.
 */
export async function acceptInvite(user: UserDoc, token: string) {
  const found = await inviteByToken(token);
  if (!found) throw new TeamError("inviteExpired");
  const { invite, gym } = found;
  if (invite.email !== user.email?.toLowerCase()) throw new TeamError("inviteOtherEmail", { email: invite.email });
  if (gym.ownerId.equals(user._id)) throw new TeamError("inviteSelf");
  await (await collections.gyms()).updateOne({ _id: gym._id }, { $addToSet: { staffIds: user._id }, $set: { updatedAt: new Date() } });
  await (await collections.staffInvites()).deleteOne({ _id: invite._id });
  await notify(gym.ownerId, { type: "system", key: "staffJoined", params: { name: user.name ?? "", gym: gym.name }, link: "/studio/team" });
  return gym;
}

/** A staff member leaving a gym on their own */
export async function leaveGym(user: UserDoc, gymId: ObjectId) {
  await (await collections.gyms()).updateOne({ _id: gymId, ownerId: { $ne: user._id } }, { $pull: { staffIds: user._id } });
}
