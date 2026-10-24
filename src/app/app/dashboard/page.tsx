import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  HiArrowRight,
  HiOutlineBookmark,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineQrCode,
  HiOutlineTicket,
  HiStar,
} from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { listUserBookings, formatMoney } from "@/server/modules/bookings";
import { passportStamps } from "@/server/modules/checkins";
import { listPublishedGyms } from "@/server/modules/gyms";
import { PassQR } from "@/components/pass/PassQR";
import { Stamp } from "@/components/passport/Stamp";
import { PushPrompt } from "@/components/notifications/PushManager";
import { cityCode } from "@/lib/data/cities";
import { formatDate } from "@/lib/dates";
import type { BookingView } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getRegion } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("nav"))("home") };
}

const stampTones = ["teal", "magenta", "ochre", "violet"] as const;

function greeting(hour: number) {
  if (hour < 5) return "late";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

async function validity(b: BookingView) {
  const [{ locale }, t] = await Promise.all([getRegion(), getTranslations("home")]);
  if (b.startDate === b.endDate) return formatDate(b.startDate, locale, { weekday: "short", day: "numeric", month: "short" });
  return t("range", { from: formatDate(b.startDate, locale), to: formatDate(b.endDate, locale) });
}

async function ActivePass({ booking }: { booking: BookingView }) {
  const [t, tp] = await Promise.all([getTranslations("home"), getTranslations("passes")]);
  return (
    <Link
      href={`/app/passes/${booking.id}`}
      className="group relative flex overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-pass ring-1 ring-gray-900/[0.06] transition-transform duration-500 ease-out-expo active:scale-[0.99] sm:hover:-translate-y-0.5"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
          <span className="truncate">
            {cityCode(booking.gym.city)} · {booking.gym.country}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-volt/15 px-2.5 py-1 text-volt">
            <span className="size-1.5 animate-pulse rounded-full bg-volt" />
            {t("active")}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">{tp(`name.${booking.passType}`)}</p>
          <p className="mt-1 truncate text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-[1.75rem]">{booking.gym.name}</p>
          <p className="mt-1.5 truncate text-sm text-white/70">
            {booking.gym.area} · {await validity(booking)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="h-1.5 flex-1 rounded-full bg-holo" />
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-volt">
            {t("showPass")}
            <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180" />
          </span>
        </div>
      </div>
      <div className="relative flex w-28 shrink-0 items-center justify-center bg-white sm:w-40">
        <span aria-hidden="true" className="absolute inset-y-3 start-0 border-s-2 border-dashed border-ink/25" />
        <span aria-hidden="true" className="absolute -top-3 -start-3 size-6 rounded-full bg-canvas" />
        <span aria-hidden="true" className="absolute -bottom-3 -start-3 size-6 rounded-full bg-canvas" />
        <PassQR code={booking.code} size={84} className="sm:hidden" />
        <PassQR code={booking.code} size={112} className="hidden sm:block" />
      </div>
    </Link>
  );
}

async function EmptyPass() {
  const t = await getTranslations("home");
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-dashed border-gray-900/10 bg-surface/60 p-6 sm:p-8">
      <div aria-hidden="true" className="absolute -end-6 -top-6 opacity-40">
        <Stamp code="FIT" label="Planet" tone="teal" size="lg" rotate={12} />
      </div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("empty.eyebrow")}</p>
      <p className="mt-2 max-w-xs text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{t("empty.title")}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-gray-600">{t("empty.text")}</p>
      <Link
        href="/gyms"
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        <HiOutlineMagnifyingGlass className="size-4" />
        {t("empty.cta")}
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser("/app/dashboard");
  const [t, tp, { locale }] = await Promise.all([getTranslations("home"), getTranslations("passes"), getRegion()]);
  const [bookings, stamps, gyms] = await Promise.all([
    listUserBookings(user._id),
    passportStamps(user._id),
    listPublishedGyms({ city: user.homeCity, limit: 8 }),
  ]);
  const suggestions = gyms.length > 0 ? gyms : await listPublishedGyms({ limit: 8 });

  const active = bookings.filter((b) => b.isActive);
  const upcoming = bookings.filter((b) => b.isUpcoming).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const cities = new Set(stamps.map((s) => `${s.city}-${s.country}`)).size;
  const visits = stamps.reduce((sum, s) => sum + s.visits, 0);
  const firstName = user.name?.split(" ")[0];
  const hour = new Date().getUTCHours();

  const quick = [
    { href: "/gyms", label: t("quick.explore"), icon: HiOutlineMagnifyingGlass },
    { href: "/app/passes", label: t("quick.passes"), icon: HiOutlineTicket },
    { href: "/app/checkins", label: t("quick.stamps"), icon: HiOutlineQrCode },
    { href: "/app/saved-gyms", label: t("quick.saved"), icon: HiOutlineBookmark },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Greeting */}
      <header className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase" suppressHydrationWarning>
            {t(`greeting.${greeting(hour)}`)}
          </p>
          <h1 className="mt-1 truncate text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
            {firstName ? t("hi", { name: firstName }) : t("hiThere")}
          </h1>
        </div>
        <Link
          href="/app/checkins"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-surface ps-1.5 pe-4 text-sm font-semibold text-ink shadow-soft ring-1 ring-gray-900/[0.06]"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-volt font-mono text-xs">{stamps.length}</span>
          {t("stampsWord", { count: stamps.length })}
        </Link>
      </header>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-8 lg:col-span-8">
          {/* Active pass(es) */}
          <section aria-label={t("activePass")} className="space-y-3">
            {active.length > 0 ? active.slice(0, 2).map((b) => <ActivePass key={b.id} booking={b} />) : <EmptyPass />}
          </section>

          {/* Quick actions */}
          <nav aria-label={t("shortcuts")} className="grid grid-cols-4 gap-2 sm:gap-3">
            {quick.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 rounded-3xl bg-surface py-4 shadow-soft ring-1 ring-gray-900/[0.05] transition-transform duration-300 ease-out-expo active:scale-95 sm:flex-row sm:justify-center sm:gap-2.5 sm:py-3.5"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-canvas text-ink transition-colors group-hover:bg-volt sm:size-9">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold text-gray-700 sm:text-sm">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Upcoming */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">{t("upcoming")}</h2>
              <Link href="/app/passes" className="text-sm font-semibold text-emerald-700">
                {t("allPasses")}
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="rounded-3xl bg-surface px-5 py-6 text-sm text-gray-500 shadow-soft ring-1 ring-gray-900/[0.05]">
                {t("noUpcoming")}
              </p>
            ) : (
              <ul className="divide-y divide-gray-900/[0.06] overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05]">
                {upcoming.slice(0, 4).map((b) => (
                  <li key={b.id}>
                    <Link href={`/app/passes/${b.id}`} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-canvas/60 sm:px-5">
                      <div className="flex w-12 shrink-0 flex-col items-center rounded-2xl bg-canvas py-1.5 text-center">
                        <span className="font-mono text-[10px] tracking-[0.1em] text-gray-500 uppercase">{formatDate(b.startDate, locale, { month: "short" })}</span>
                        <span className="text-lg leading-none font-semibold text-ink tabular-nums">{formatDate(b.startDate, locale, { day: "numeric" })}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">{b.gym.name}</p>
                        <p className="truncate text-sm text-gray-500">
                          {tp(`name.${b.passType}`)} · {b.gym.area}
                        </p>
                      </div>
                      <HiArrowRight className="size-4 shrink-0 text-gray-300 rtl:rotate-180" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <PushPrompt title={t("push.title")} body={t("push.body")} />

          {/* Passport summary */}
          <section className="relative overflow-hidden rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05]">
            <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("passport")}</p>
            <dl className="mt-4 grid grid-cols-3 gap-2">
              {[
                [t("stats.gyms"), stamps.length],
                [t("stats.cities"), cities],
                [t("stats.visits"), visits],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-canvas px-3 py-3">
                  <dd className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</dd>
                  <dt className="text-xs text-gray-500">{label}</dt>
                </div>
              ))}
            </dl>
            {stamps.length > 0 ? (
              <div className="mt-5 flex items-center gap-1 overflow-hidden">
                {stamps.slice(0, 4).map((s, i) => (
                  <Stamp
                    key={s.gymId}
                    code={cityCode(s.city)}
                    label={s.name}
                    size="sm"
                    tone={stampTones[i % stampTones.length]}
                    shape={i % 3 === 1 ? "dashed" : "circle"}
                    rotate={[-10, 6, -4, 12][i % 4]}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-gray-500">{t("firstStamp")}</p>
            )}
          </section>
        </aside>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">{user.homeCity && gyms.length > 0 ? t("trainIn", { city: user.homeCity }) : t("popular")}</h2>
            <Link href="/gyms" className="text-sm font-semibold text-emerald-700">
              {t("seeAll")}
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {suggestions.slice(0, 8).map((gym) => {
              const pct = gym.capacity.max ? Math.round((gym.capacity.current / gym.capacity.max) * 100) : 0;
              return (
                <Link
                  key={gym.id}
                  href={`/gyms/${gym.slug}`}
                  className="group w-[72%] shrink-0 snap-start overflow-hidden rounded-3xl bg-surface shadow-soft ring-1 ring-gray-900/[0.05] sm:w-[44%] lg:w-auto"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-canvas-deep">
                    <Image src={gym.coverImage} alt="" fill sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 25vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                    <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink">
                      <HiStar className="size-3.5 text-stamp-ochre" />
                      {gym.rating.toFixed(1)}
                    </span>
                    <span
                      className={cn(
                        "absolute top-3 end-3 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase",
                        pct >= 80 ? "bg-stamp-magenta text-white" : pct >= 50 ? "bg-stamp-ochre text-white" : "bg-ink/85 text-volt",
                      )}
                    >
                      {pct >= 80 ? t("crowd.busy") : pct >= 50 ? t("crowd.steady") : t("crowd.quiet")}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="truncate text-[15px] font-semibold text-ink">{gym.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-gray-500">
                      <HiOutlineMapPin className="size-3.5 shrink-0" />
                      {gym.address.area}, {gym.address.city}
                    </p>
                    <p className="mt-3 text-sm text-gray-600">
                      <span className="font-semibold whitespace-nowrap text-ink">{formatMoney(gym.pricing.dayPass, gym.currency)}</span> {t("perDay")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
