import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { AcceptInviteForm } from "@/components/studio/AcceptInviteForm";
import { getSessionUser } from "@/server/session";
import { inviteByToken } from "@/server/modules/team";
import { signOutAction } from "@/actions/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.join"))("meta"), robots: { index: false } };
}

export default async function JoinTeamPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const [t, user, found] = await Promise.all([getTranslations("studio.join"), getSessionUser(), inviteByToken(token)]);
  const back = `/studio/join?token=${encodeURIComponent(token)}`;

  if (!found) {
    return (
      <AuthShell variant="studio">
        <AuthHeading eyebrow={t("eyebrow")} title={t("expiredTitle")} subtitle={t("expiredText")} />
        <Link href="/studio/login" className="text-sm font-semibold text-ink underline underline-offset-4">
          {t("toStudio")}
        </Link>
      </AuthShell>
    );
  }

  const { invite, gym } = found;
  const place = [gym.address.area, gym.address.city].filter(Boolean).join(", ");
  const wrongAccount = user && user.email?.toLowerCase() !== invite.email;

  return (
    <AuthShell variant="studio">
      <AuthHeading eyebrow={t("eyebrow")} title={t("title", { gym: gym.name })} subtitle={t("subtitle", { place, email: invite.email })} />
      {!user ? (
        <div className="space-y-3">
          <Link
            href={`/studio/login?next=${encodeURIComponent(back)}`}
            className="flex h-12 w-full items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white transition-colors hover:bg-gray-800"
          >
            {t("signIn")}
          </Link>
          <Link
            href={`/studio/register?next=${encodeURIComponent(back)}`}
            className="flex h-12 w-full items-center justify-center rounded-full bg-surface text-[15px] font-semibold text-ink ring-1 ring-gray-900/[0.08] transition-colors hover:bg-canvas"
          >
            {t("createAccount")}
          </Link>
          <p className="text-center text-xs text-gray-500">{t("useEmail", { email: invite.email })}</p>
        </div>
      ) : wrongAccount ? (
        <div className="space-y-4">
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-600/15">
            {t("wrongAccount", { current: user.email ?? "", email: invite.email })}
          </p>
          <form action={signOutAction}>
            <input type="hidden" name="next" value={back} />
            <button type="submit" className="h-12 w-full cursor-pointer rounded-full bg-ink text-[15px] font-semibold text-white transition-colors hover:bg-gray-800">
              {t("switchAccount")}
            </button>
          </form>
        </div>
      ) : (
        <AcceptInviteForm token={token} />
      )}
    </AuthShell>
  );
}
