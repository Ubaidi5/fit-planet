import type { Metadata } from "next";
import { requireUser } from "@/server/session";
import { ensureHandle, socialPrefsOf } from "@/server/modules/social";
import { BackLink } from "@/components/routines/BackLink";
import { SocialSettings } from "@/components/social/SocialSettings";

export const metadata: Metadata = { title: "Social settings" };

export default async function SocialSettingsPage() {
  const user = await requireUser("/app/social/settings");
  const handle = await ensureHandle(user);
  const prefs = socialPrefsOf(user);
  return (
    <div className="mx-auto max-w-xl">
      <BackLink href="/app/social" label="Social" />
      <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Social profile</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">How you appear to other members, and what you share.</p>
      <div className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-6">
        <SocialSettings initial={{ handle, bio: user.bio ?? "", visibility: prefs.visibility, shareCheckins: prefs.shareCheckins }} />
      </div>
    </div>
  );
}
