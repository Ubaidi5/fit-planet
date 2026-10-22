"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  HiArrowPath,
  HiArrowRight,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineQrCode,
  HiPlus,
  HiXMark,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatPassDate } from "@/lib/i18n/format";
import { cityCode } from "@/lib/data/cities";
import { mockGyms, type Gym } from "@/lib/data/mock-gyms";
import { mockBookings, formatPassType, type Booking } from "@/lib/data/mock-bookings";
import { PassCard, type PassTone } from "@/components/passport/PassCard";
import { Stamp } from "@/components/passport/Stamp";
import { MrzLine } from "@/components/passport/MrzLine";
import { FauxQR } from "@/components/brand/FauxQR";

interface WalletPass {
  booking: Booking;
  gym: Gym;
}

const STEP = 64;
const CARD_HEIGHT = 176;
const stampTones = ["teal", "magenta", "ochre", "violet"] as const;
const stampShapes = ["circle", "rect", "dashed"] as const;

function withGym(booking: Booking): WalletPass | null {
  const gym = mockGyms.find((g) => g.id === booking.gymId);
  return gym ? { booking, gym } : null;
}

const utcDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export default function MyPassesPage() {
  const { region, money } = useLocale();
  const passes = useMemo(() => mockBookings.map(withGym).filter((p): p is WalletPass => p !== null), []);
  const wallet = passes.filter(({ booking }) => booking.status === "active" || booking.status === "upcoming");
  const history = passes.filter(({ booking }) => booking.status === "expired" || booking.status === "cancelled");

  const [selectedId, setSelectedId] = useState(wallet[0]?.booking.id);
  const [showQr, setShowQr] = useState(false);
  const selected = wallet.find(({ booking }) => booking.id === selectedId) ?? wallet[0];

  useEffect(() => {
    if (!showQr) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setShowQr(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showQr]);

  // Selected pass goes to the front of the stack; the rest keep their order behind it
  const order = selected ? [...wallet.filter((p) => p !== selected), selected] : wallet;

  const dateFormat = (iso: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
    new Intl.DateTimeFormat(region.locale, { ...options, timeZone: "UTC" }).format(utcDate(iso));

  const validity = (booking: Booking) =>
    booking.startDate === booking.endDate
      ? dateFormat(booking.startDate, { weekday: "short", day: "numeric", month: "short" })
      : `${dateFormat(booking.startDate)} – ${dateFormat(booking.endDate)}`;

  // One stamp per city with a check-in, newest last
  const stamps = useMemo(() => {
    const byCity = new Map<string, { city: string; date: string }>();
    [...passes]
      .filter(({ booking }) => booking.totalCheckIns > 0 && booking.lastCheckIn)
      .sort((a, b) => (a.booking.lastCheckIn ?? "").localeCompare(b.booking.lastCheckIn ?? ""))
      .forEach(({ gym, booking }) => {
        if (!byCity.has(gym.address.city)) byCity.set(gym.address.city, { city: gym.address.city, date: booking.lastCheckIn! });
      });
    return [...byCity.values()];
  }, [passes]);
  const pendingStamp = wallet.find(
    ({ gym, booking }) => booking.status === "active" && !stamps.some((s) => s.city === gym.address.city),
  );
  const countries = new Set(passes.filter(({ booking }) => booking.totalCheckIns > 0).map(({ gym }) => gym.country));
  const visits = passes.reduce((sum, { booking }) => sum + booking.totalCheckIns, 0);

  const toneFor = (pass: WalletPass): PassTone =>
    pass === selected ? "ink" : pass.booking.status === "upcoming" ? "mint" : "paper";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[12px] tracking-[0.16em] text-emerald-700 uppercase">
            Wallet · {wallet.length} {wallet.length === 1 ? "pass" : "passes"}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">My passes</h1>
        </div>
        <Link
          href="/gyms"
          className="group inline-flex h-12 w-fit items-center gap-2 rounded-full bg-ink ps-5 pe-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Book a new pass
          <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-90">
            <HiPlus className="size-4" />
          </span>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
        {/* Wallet */}
        <section aria-label="Active and upcoming passes" className="min-w-0">
          {wallet.length > 0 && selected ? (
            <>
              <div className="relative" style={{ height: CARD_HEIGHT + (order.length - 1) * STEP }}>
                {order.map((pass, position) => {
                  const isFront = position === order.length - 1;
                  const depth = order.length - 1 - position;
                  const { booking, gym } = pass;
                  return (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => setSelectedId(booking.id)}
                      aria-pressed={isFront}
                      aria-label={`${gym.name}, ${formatPassType(booking.passType)}`}
                      className="absolute inset-x-0 top-0 block origin-top text-start transition-transform duration-700 ease-out-expo focus-visible:outline-none"
                      style={{
                        transform: `translateY(${position * STEP}px) scale(${1 - depth * 0.035})`,
                        zIndex: position + 1,
                      }}
                    >
                      <PassCard
                        cityCode={cityCode(gym.address.city)}
                        country={gym.country}
                        gymName={gym.name}
                        passType={booking.status === "upcoming" ? `Starts ${dateFormat(booking.startDate)}` : formatPassType(booking.passType)}
                        price={money(booking.finalPrice, gym.currency)}
                        meta={validity(booking)}
                        tone={toneFor(pass)}
                        className={cn("h-44 transition-shadow duration-500", !isFront && "hover:shadow-lift")}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Selected pass details */}
              <div key={selected.booking.id} className="mt-6 animate-fade-up rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-soft sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setShowQr(true)}
                    className="group relative mx-auto w-fit shrink-0 overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-gray-900/[0.06] sm:mx-0"
                    aria-label="Show QR full screen"
                  >
                    <FauxQR seed={selected.booking.qrCode} size={132} />
                    {selected.booking.status === "active" && (
                      <span aria-hidden="true" className="absolute inset-x-3 top-3 h-1/2 animate-scan">
                        <span className="block h-0.5 w-full bg-emerald-500 shadow-[0_0_12px_2px] shadow-emerald-400/70" />
                      </span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase",
                          selected.booking.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-stamp-violet/10 text-stamp-violet",
                        )}
                      >
                        {selected.booking.status === "active" ? "Active" : "Upcoming"}
                      </span>
                      <span className="truncate font-mono text-[11px] tracking-[0.08em] text-gray-400">{selected.booking.qrCode}</span>
                    </div>
                    <p className="mt-3 truncate text-2xl font-semibold tracking-[-0.03em] text-ink">{selected.gym.name}</p>
                    <dl className="mt-4 grid grid-cols-3 gap-3">
                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">Valid</dt>
                        <dd className="mt-0.5 text-sm font-medium text-ink">{validity(selected.booking)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">Check-ins</dt>
                        <dd className="mt-0.5 text-sm font-medium text-ink tabular-nums">{selected.booking.totalCheckIns}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">Paid</dt>
                        <dd className="mt-0.5 text-sm font-medium whitespace-nowrap text-ink tabular-nums">
                          {money(selected.booking.finalPrice, selected.gym.currency)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShowQr(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    <HiOutlineQrCode className="size-5" />
                    Show at entrance
                  </button>
                  <Link
                    href={`/gyms/${selected.gym.slug}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-canvas text-sm font-medium text-ink ring-1 ring-gray-900/[0.06] transition-colors hover:bg-gray-100"
                  >
                    <HiOutlineMapPin className="size-5" />
                    View gym
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center rounded-4xl border border-dashed border-gray-900/15 bg-surface/60 px-6 py-16 text-center">
              <HiOutlineQrCode className="size-10 text-gray-300" />
              <h2 className="mt-4 text-lg font-semibold text-ink">Your wallet is empty</h2>
              <p className="mt-1 max-w-xs text-sm text-gray-500">Book a pass at any partner gym and it will land here with its QR.</p>
              <Link href="/gyms" className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-white">
                Find a gym
              </Link>
            </div>
          )}
        </section>

        {/* Passport */}
        <section aria-label="Passport stamps" className="min-w-0">
          <div className="overflow-hidden rounded-4xl bg-surface shadow-pass ring-1 ring-gray-900/[0.06]">
            <div className="bg-[linear-gradient(var(--color-volt-soft),var(--color-surface))] p-6 sm:p-8">
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
                <span>Passport · Stamps</span>
                <span>{String(stamps.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-6 grid grid-cols-3 place-items-center gap-y-5 sm:gap-y-7">
                {stamps.map((stamp, index) => (
                  <Stamp
                    key={stamp.city}
                    code={cityCode(stamp.city)}
                    label={stamp.city}
                    date={formatPassDate(utcDate(stamp.date), region.locale)}
                    tone={stampTones[index % stampTones.length]}
                    shape={stampShapes[index % stampShapes.length]}
                    rotate={[-9, 7, -4, 11, -12, 5][index % 6]}
                    size="sm"
                    className="animate-fade-up sm:scale-125"
                    style={{ animationDelay: `${index * 80}ms` }}
                  />
                ))}
                {pendingStamp && (
                  <div className="flex size-16 flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-center font-mono text-gray-400 sm:scale-125">
                    <span className="text-[11px] font-semibold tracking-[0.12em]">{cityCode(pendingStamp.gym.address.city)}</span>
                    <span className="text-[7px] tracking-[0.1em] uppercase">Check in</span>
                  </div>
                )}
              </div>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-dashed divide-gray-900/15 border-y border-dashed border-gray-900/15 rtl:divide-x-reverse">
              {[
                { label: "Cities", value: stamps.length },
                { label: "Countries", value: countries.size },
                { label: "Visits", value: visits },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center py-4">
                  <dt className="order-2 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-ink tabular-nums">{String(stat.value).padStart(2, "0")}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-1 overflow-hidden px-6 py-5 sm:px-8" dir="ltr">
              <MrzLine text="Fit Planet Passport Holder" className="text-[11px] text-gray-500" />
              <MrzLine text={`Stamps ${stamps.map((s) => cityCode(s.city)).join(" ")}`} className="text-[11px] text-gray-500" />
            </div>
          </div>
          {pendingStamp && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-volt-soft px-4 py-3 text-sm text-emerald-800">
              <HiOutlineClock className="size-4.5 shrink-0" />
              Check in at {pendingStamp.gym.name} to collect your {pendingStamp.gym.address.city} stamp.
            </p>
          )}
        </section>
      </div>

      {/* History */}
      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-[12px] tracking-[0.16em] text-gray-400 uppercase">Past passes</h2>
          <ul className="mt-4 divide-y divide-gray-900/[0.06] overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface shadow-soft">
            {history.map(({ booking, gym }) => (
              <li key={booking.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-canvas font-mono text-[13px] font-semibold tracking-[0.1em] text-ink ring-1 ring-gray-900/[0.05]">
                  {cityCode(gym.address.city)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{gym.name}</p>
                  <p className="truncate text-sm text-gray-500">
                    {formatPassType(booking.passType)} · {validity(booking)}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm font-medium whitespace-nowrap text-ink tabular-nums sm:block">
                  {money(booking.finalPrice, gym.currency)}
                </span>
                <Link
                  href={`/gyms/${gym.slug}`}
                  className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-canvas px-3.5 text-[13px] font-medium text-ink ring-1 ring-gray-900/[0.06] transition-colors hover:bg-gray-100"
                >
                  <HiArrowPath className="size-4 transition-transform duration-500 group-hover:-rotate-180" />
                  <span className="hidden sm:inline">Book again</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Full-screen QR */}
      {showQr && selected && (
        <div role="dialog" aria-modal="true" aria-label="Entrance QR" className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm animate-fade-up rounded-[2rem] bg-surface p-6 text-center shadow-lift">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
                {cityCode(selected.gym.address.city)} · {selected.gym.country}
              </span>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full bg-canvas text-gray-600 transition-colors hover:text-ink"
              >
                <HiXMark className="size-5" />
              </button>
            </div>
            <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">{selected.gym.name}</p>
            <p className="mt-1 text-sm text-gray-500">{validity(selected.booking)}</p>
            <div className="relative mx-auto mt-6 w-fit overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-gray-900/[0.06]">
              <FauxQR seed={selected.booking.qrCode} size={220} />
              <span aria-hidden="true" className="absolute inset-x-4 top-4 h-1/2 animate-scan">
                <span className="block h-0.5 w-full bg-emerald-500 shadow-[0_0_12px_2px] shadow-emerald-400/70" />
              </span>
            </div>
            <p className="mt-5 font-mono text-[12px] tracking-[0.1em] text-gray-500">{selected.booking.qrCode}</p>
            <Link
              href={`/gyms/${selected.gym.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700"
            >
              Gym details
              <HiArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
