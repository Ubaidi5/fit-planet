import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { recentCheckins } from "@/server/modules/checkins";
import { PageHeader } from "@/components/studio/PageHeader";
import { CheckinDesk } from "@/components/studio/CheckinDesk";
import { getRegion } from "@/lib/i18n/server";
import { leaveGymAction } from "@/actions/team";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("checkin") };
}

export default async function CheckinPage() {
  const { gyms, gym, role } = await requireOwner("/studio/checkin");
  const recent = await recentCheckins({ gymIds: gyms.map((g) => g._id) }, 12);
  const [t, tp, tt, region] = await Promise.all([getTranslations("studio.pages"), getTranslations("passes"), getTranslations("studio.team"), getRegion()]);
  const timeFmt = new Intl.DateTimeFormat(region.locale, { hour: "numeric", minute: "2-digit", timeZone: gyms[0].timezone });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={t("frontDesk")} title={t("checkin")} description={t("checkinHint")} />
      <CheckinDesk />
      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("recentCheckins")}</h2>
          <ul className="mt-3 divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-16 shrink-0 font-mono text-xs text-gray-500 tabular-nums">{timeFmt.format(new Date(c.at))}</span>
                <p className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-medium text-ink">{c.memberName}</span>
                  <span className="text-gray-500"> · {tp(`name.${c.passType}`)}</span>
                </p>
                <span className="hidden font-mono text-[11px] text-gray-400 sm:block">{c.bookingCode}</span>
                <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-gray-600 uppercase">{t(`method.${c.method}`)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {role === "staff" && (
        <form action={leaveGymAction} className="mt-10 flex flex-col items-start gap-2 border-t border-gray-900/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">{tt("staffOf", { gym: gym.name })}</p>
          <input type="hidden" name="gymId" value={gym._id.toHexString()} />
          <button type="submit" className="h-9 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50">
            {tt("leave")}
          </button>
        </form>
      )}
    </div>
  );
}
