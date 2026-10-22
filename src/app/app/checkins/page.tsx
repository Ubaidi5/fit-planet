import type { Metadata } from "next";
import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { passportStamps, recentCheckins } from "@/server/modules/checkins";
import { Stamp } from "@/components/passport/Stamp";
import { MrzLine } from "@/components/passport/MrzLine";
import { cityCode } from "@/lib/data/cities";
import { passMeta } from "@/lib/passes";

export const metadata: Metadata = { title: "Passport" };

const tones = ["teal", "magenta", "ochre", "violet"] as const;
const shapes = ["circle", "rect", "dashed"] as const;

export default async function PassportPage() {
  const user = await requireUser("/app/checkins");
  const [stamps, visits] = await Promise.all([passportStamps(user._id), recentCheckins({ userId: user._id }, 100)]);
  const cities = new Set(stamps.map((s) => s.city));
  const countries = new Set(stamps.map((s) => s.country));
  const dateFmt = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "2-digit" });
  const timeFmt = new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

  // Group visits by month for the history list
  const months = new Map<string, typeof visits>();
  for (const v of visits) {
    const key = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(v.at));
    months.set(key, [...(months.get(key) ?? []), v]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section className="overflow-hidden rounded-[2rem] bg-surface shadow-pass ring-1 ring-gray-900/[0.06]">
        <div className="bg-[linear-gradient(var(--color-volt-soft),var(--color-surface))] p-6 sm:p-8">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
            <span>Passport · {user.name}</span>
            <span>{String(stamps.length).padStart(2, "0")} stamps</span>
          </div>
          <h1 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Your passport</h1>
          {stamps.length === 0 ? (
            <div className="mt-8 flex flex-col items-center py-10 text-center">
              <div className="flex size-24 items-center justify-center rounded-full border-[3px] border-dashed border-gray-300 font-mono text-sm text-gray-400">FIRST</div>
              <p className="mt-5 font-semibold text-ink">No stamps yet</p>
              <p className="mt-1 max-w-xs text-sm text-gray-500">Every new gym you check in at adds a stamp. Collect cities as you travel.</p>
              <Link href="/gyms" className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                Find a gym
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-3 place-items-center gap-y-8 sm:grid-cols-4">
              {stamps.map((s, i) => (
                <Link key={s.gymId} href={`/gyms/${s.slug}`} className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                  <Stamp
                    code={cityCode(s.city)}
                    label={s.city}
                    date={dateFmt.format(new Date(s.first))}
                    tone={tones[i % tones.length]}
                    shape={shapes[i % shapes.length]}
                    rotate={[-9, 7, -4, 11, -12, 5][i % 6]}
                    size="sm"
                    className="sm:scale-125"
                  />
                  <span className="max-w-24 truncate text-center text-xs text-gray-600 sm:mt-2">{s.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <dl className="grid grid-cols-3 divide-x divide-dashed divide-gray-900/15 border-y border-dashed border-gray-900/15 rtl:divide-x-reverse">
          {[
            ["Gyms", stamps.length],
            ["Cities", cities.size],
            ["Countries", countries.size],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col items-center py-4">
              <dt className="order-2 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">{label}</dt>
              <dd className="text-2xl font-semibold text-ink tabular-nums">{String(value).padStart(2, "0")}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-1 overflow-hidden px-6 py-5 sm:px-8" dir="ltr">
          <MrzLine text={`Fit Planet Passport ${user.name ?? ""}`} className="text-[11px] text-gray-500" />
          <MrzLine text={`Stamps ${stamps.map((s) => cityCode(s.city)).join(" ") || "none"}`} className="text-[11px] text-gray-500" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">Visits</h2>
        {visits.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Your check-ins will be listed here.</p>
        ) : (
          [...months.entries()].map(([month, list]) => (
            <div key={month} className="mt-4">
              <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
                {month} · {list.length}
              </p>
              <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
                {list.map((v) => (
                  <li key={v.id}>
                    <Link href={`/gyms/${v.gym.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-canvas/50">
                      <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-canvas font-mono text-xs font-semibold tracking-[0.08em] text-ink">{cityCode(v.gym.city)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{v.gym.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                          <HiOutlineMapPin className="size-3 shrink-0" />
                          {timeFmt.format(new Date(v.at))} · {passMeta[v.passType].short}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
