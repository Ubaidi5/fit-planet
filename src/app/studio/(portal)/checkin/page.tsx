import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { recentCheckins } from "@/server/modules/checkins";
import { PageHeader } from "@/components/studio/PageHeader";
import { CheckinDesk } from "@/components/studio/CheckinDesk";
import { passMeta } from "@/lib/passes";

export const metadata: Metadata = { title: "Check-in desk" };

export default async function CheckinPage() {
  const { gyms } = await requireOwner("/studio/checkin");
  const recent = await recentCheckins({ gymIds: gyms.map((g) => g._id) }, 12);
  const timeFmt = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: gyms[0].timezone });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow="Front desk" title="Check-in" description="Scan the QR on a member's pass or type its code." />
      <CheckinDesk />
      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Today and earlier</h2>
          <ul className="mt-3 divide-y divide-gray-900/[0.06] overflow-hidden rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-16 shrink-0 font-mono text-xs text-gray-500 tabular-nums">{timeFmt.format(new Date(c.at))}</span>
                <p className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-medium text-ink">{c.memberName}</span>
                  <span className="text-gray-500"> · {passMeta[c.passType].label}</span>
                </p>
                <span className="hidden font-mono text-[11px] text-gray-400 sm:block">{c.bookingCode}</span>
                <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-gray-600 uppercase">{c.method}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
