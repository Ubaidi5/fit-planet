import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { requireOwner, initials } from "@/server/session";
import { teamOf } from "@/server/modules/team";
import { PageHeader } from "@/components/studio/PageHeader";
import { InviteStaffForm } from "@/components/studio/InviteStaffForm";
import { cancelInviteAction, removeStaffAction } from "@/actions/team";
import { getRegion } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("team") };
}

const can = ["canCheckin", "canBookings", "canDesk"] as const;
const cannot = ["noRevenue", "noListing", "noCancel"] as const;

export default async function StudioTeamPage() {
  const { gym } = await requireOwner("/studio/team", { ownerOnly: true });
  const [{ staff, invites }, t, region] = await Promise.all([teamOf(gym), getTranslations("studio.team"), getRegion()]);
  const date = new Intl.DateTimeFormat(region.locale, { day: "numeric", month: "short" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={gym.name} title={t("title")} description={t("subtitle")} />

      <div className="space-y-5">
        <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-7">
          <h2 className="text-lg font-semibold text-ink">{t("inviteTitle")}</h2>
          <p className="mt-1 mb-5 text-sm text-gray-500">{t("inviteText")}</p>
          <InviteStaffForm />
          <div className="mt-6 grid gap-x-6 gap-y-2 border-t border-gray-900/[0.06] pt-5 text-sm sm:grid-cols-2">
            {can.map((key) => (
              <p key={key} className="flex items-start gap-2.5 text-gray-600">
                <HiOutlineCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                {t(key)}
              </p>
            ))}
            {cannot.map((key) => (
              <p key={key} className="flex items-start gap-2.5 text-gray-500">
                <HiOutlineXMark className="mt-0.5 size-4 shrink-0 text-gray-400" />
                {t(key)}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-7">
          <h2 className="text-lg font-semibold text-ink">{t("staffTitle", { count: staff.length })}</h2>
          {staff.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{t("noStaff")}</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-900/[0.06]">
              {staff.map((member) => (
                <li key={member.id} className="flex items-center gap-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-semibold text-ink">
                    {initials(member.name || member.email)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-ink">{member.name || member.email}</p>
                    <p className="truncate text-sm text-gray-500">{member.email}</p>
                  </div>
                  <form action={removeStaffAction}>
                    <input type="hidden" name="userId" value={member.id} />
                    <button type="submit" className="h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50">
                      {t("remove")}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}

          {invites.length > 0 && (
            <>
              <h3 className="mt-6 font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("pending")}</h3>
              <ul className="mt-2 divide-y divide-gray-900/[0.06]">
                {invites.map((invite) => (
                  <li key={invite.id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] text-ink">{invite.email}</p>
                      <p className="text-xs text-gray-500">{t("expires", { date: date.format(new Date(invite.expiresAt)) })}</p>
                    </div>
                    <form action={cancelInviteAction}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <button type="submit" className="h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-gray-600 transition-colors hover:bg-canvas hover:text-ink">
                        {t("cancelInvite")}
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
