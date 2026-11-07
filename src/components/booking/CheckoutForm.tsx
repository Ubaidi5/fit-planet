"use client";

import { useTranslations } from "next-intl";
import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiArrowLeft,
  HiCheck,
  HiOutlineBuildingStorefront,
  HiOutlineCalendarDays,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { addDays, formatDate } from "@/lib/dates";
import { passMeta, PASS_TYPES, type PassType } from "@/lib/passes";
import { cityCode } from "@/lib/data/cities";
import type { Gym } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { bookPassAction } from "@/actions/bookings";
import { track } from "@/lib/analytics/browser";
import { Input } from "@/components/ui/Input";
import { FormAlert } from "@/components/auth/FormBits";
import { useFormStatus } from "react-dom";

interface CheckoutFormProps {
  gym: Gym;
  today: string;
  maxDaysAhead: number;
  initialPass: PassType;
  initialDate: string;
  holder: { name: string; phone: string };
  onlineEnabled: boolean;
  onlineProvider: string;
  deskEnabled: boolean;
  cancelled?: boolean;
}

const stepLabel = "font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase";

function PayButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations("checkout");
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white shadow-lift transition-[background-color,transform] duration-300 ease-out-expo hover:bg-gray-800 active:scale-[0.98] disabled:opacity-70"
    >
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-e-transparent" aria-hidden="true" />
          {t("securing")}
        </>
      ) : (
        <>
          <HiOutlineLockClosed className="size-4.5" />
          {label}
        </>
      )}
    </button>
  );
}

export function CheckoutForm(props: CheckoutFormProps) {
  const { gym, today } = props;
  const { region, money } = useLocale();
  const tc = useTranslations("checkout");
  const tp = useTranslations("passes");
  const [state, action] = useActionState(bookPassAction, null);
  const available = PASS_TYPES.filter((t) => gym.pricing[passMeta[t].pricingKey] > 0);
  const [passType, setPassType] = useState<PassType>(available.includes(props.initialPass) ? props.initialPass : available[0]);
  const [startDate, setStartDate] = useState(props.initialDate);
  const [payment, setPayment] = useState<"online" | "desk">(props.onlineEnabled ? "online" : "desk");
  const errors = state && !state.ok ? state.fieldErrors : undefined;

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, i)), [today]);
  const meta = passMeta[passType];
  const price = gym.pricing[meta.pricingKey];
  const endDate = addDays(startDate, meta.days - 1);
  const fmt = (date: string, options: Intl.DateTimeFormatOptions) => formatDate(date, region.locale, options);
  const validity =
    meta.days === 1
      ? fmt(startDate, { weekday: "long", day: "numeric", month: "long" })
      : tc("range", { from: fmt(startDate, { day: "numeric", month: "short" }), to: fmt(endDate, { day: "numeric", month: "short" }) });
  const total = money(price, gym.currency);
  const cta = payment === "desk" ? tc("reserveDesk") : tc("pay", { total });

  return (
    <form
      action={action}
      onSubmit={() =>
        track({
          name: "begin_checkout",
          paymentMethod: payment,
          pass: { gymId: gym.id, gymName: gym.name, city: gym.address.city, passType, amount: price, currency: gym.currency },
        })
      }
      className="mx-auto max-w-6xl pb-36 lg:pb-16"
    >
      <input type="hidden" name="gymId" value={gym.id} />
      <input type="hidden" name="passType" value={passType} />
      <input type="hidden" name="startDate" value={startDate} />
      <input type="hidden" name="paymentMethod" value={payment} />

      <Link href={`/gyms/${gym.slug}`} className="inline-flex h-10 items-center gap-2 rounded-full ps-1 pe-3 text-sm font-medium text-gray-600 hover:text-ink">
        <HiArrowLeft className="size-4 rtl:rotate-180" />
        {gym.name}
      </Link>
      <h1 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{tc("title")}</h1>

      {props.cancelled && <FormAlert className="mt-5">{tc("cancelled")}</FormAlert>}
      {state && !state.ok && !state.fieldErrors && <FormAlert className="mt-5">{state.error}</FormAlert>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="space-y-8">
          {/* 1. Pass */}
          <section aria-labelledby="step-pass">
            <p id="step-pass" className={stepLabel}>
              01 · {tc("steps.pass")}
            </p>
            <div role="radiogroup" aria-label={tc("passType")} className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {available.map((type) => {
                const m = passMeta[type];
                const selected = type === passType;
                const perDay = type !== "day" ? gym.pricing[m.pricingKey] / m.days : null;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPassType(type)}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-between gap-3 rounded-3xl p-4 text-start ring-1 transition-all duration-300 ease-out-expo sm:flex-col sm:items-start sm:p-5",
                      selected ? "bg-ink text-white shadow-lift ring-ink" : "bg-surface text-ink shadow-soft ring-gray-900/[0.06] hover:ring-gray-900/15",
                    )}
                  >
                    <div className="min-w-0">
                      <p className={cn("font-mono text-[11px] tracking-[0.12em] uppercase", selected ? "text-volt" : "text-gray-400")}>{tp(`short.${type}`)}</p>
                      <p className="mt-0.5 text-base font-semibold">{tp(`name.${type}`)}</p>
                      <p className={cn("mt-0.5 text-xs", selected ? "text-white/60" : "text-gray-500")}>
                        {type === "day" ? tc("oneEntry") : tc("daysOnce", { days: m.days })}
                      </p>
                    </div>
                    <div className="shrink-0 text-end sm:text-start">
                      <p className="text-lg font-semibold whitespace-nowrap tabular-nums">{money(gym.pricing[m.pricingKey], gym.currency)}</p>
                      {perDay && (
                        <p className={cn("text-xs whitespace-nowrap", selected ? "text-white/60" : "text-gray-500")}>{money(Math.round(perDay), gym.currency)} {tc("perDay")}</p>
                      )}
                    </div>
                    {selected && (
                      <span className="absolute top-3 end-3 hidden size-6 items-center justify-center rounded-full bg-volt text-ink sm:flex">
                        <HiCheck className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Date */}
          <section aria-labelledby="step-date">
            <div className="flex items-end justify-between gap-3">
              <p id="step-date" className={stepLabel}>
                02 · {tc("steps.date")}
              </p>
              <label className="relative inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                <HiOutlineCalendarDays className="size-4" />
                {tc("otherDate")}
                <input
                  type="date"
                  min={today}
                  max={addDays(today, props.maxDaysAhead)}
                  value={startDate}
                  onChange={(e) => e.target.value && setStartDate(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={tc("pickDate")}
                />
              </label>
            </div>
            <div className="-mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              {days.map((date, i) => {
                const selected = date === startDate;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setStartDate(date)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-14 shrink-0 cursor-pointer snap-start flex-col items-center rounded-2xl py-2.5 ring-1 transition-all duration-300 ease-out-expo",
                      selected ? "bg-volt text-ink ring-transparent shadow-soft" : "bg-surface text-ink ring-gray-900/[0.06] hover:ring-gray-900/15",
                    )}
                  >
                    <span className={cn("font-mono text-[10px] tracking-[0.1em] uppercase", selected ? "text-ink/70" : "text-gray-400")}>
                      {i === 0 ? tc("today") : fmt(date, { weekday: "short" })}
                    </span>
                    <span className="mt-0.5 text-lg leading-none font-semibold tabular-nums">{fmt(date, { day: "numeric" })}</span>
                    <span className={cn("mt-0.5 text-[10px]", selected ? "text-ink/70" : "text-gray-400")}>{fmt(date, { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {tc.rich("validLine", { validity, b: (c) => <span className="font-semibold text-ink">{c}</span> })}
              <span className="text-gray-400"> · {tc("cityTime", { city: gym.address.city })}</span>
            </p>
          </section>

          {/* 3. Holder */}
          <section aria-labelledby="step-holder">
            <p id="step-holder" className={stepLabel}>
              03 · {tc("steps.holder")}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input
                name="guestName"
                label={tc("holderName")}
                defaultValue={props.holder.name}
                autoComplete="name"
                leftIcon={<HiOutlineUser className="size-4.5" />}
                error={errors?.guestName}
                required
              />
              <Input name="guestPhone" label={tc("phone")} type="tel" defaultValue={props.holder.phone} autoComplete="tel" hint={tc("phoneHint")} />
            </div>
          </section>

          {/* 4. Payment */}
          <section aria-labelledby="step-pay">
            <p id="step-pay" className={stepLabel}>
              04 · {tc("steps.payment")}
            </p>
            <div role="radiogroup" aria-label={tc("method")} className="mt-3 grid gap-2.5">
              {props.onlineEnabled && (
                <PaymentOption
                  selected={payment === "online"}
                  onSelect={() => setPayment("online")}
                  icon={<HiOutlineCreditCard className="size-5" />}
                  title={tc("payNow")}
                  text={props.onlineProvider === "mock" ? tc("testMode") : tc("onlineText")}
                />
              )}
              {props.deskEnabled && (
                <PaymentOption
                  selected={payment === "desk"}
                  onSelect={() => setPayment("desk")}
                  icon={<HiOutlineBuildingStorefront className="size-5" />}
                  title={tc("deskTitle")}
                  text={tc("deskText")}
                />
              )}
            </div>
          </section>
        </div>

        {/* Summary (boarding pass) */}
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2rem] bg-surface shadow-pass ring-1 ring-gray-900/[0.06]">
            <div className="relative h-28 bg-ink">
              <Image src={gym.coverImage} alt="" fill sizes="384px" className="object-cover opacity-50" />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3 text-white">
                <div className="min-w-0">
                  <p className="font-mono text-2xl font-semibold tracking-[0.06em] text-volt">{cityCode(gym.address.city)}</p>
                  <p className="truncate text-sm font-semibold">{gym.name}</p>
                </div>
                <span className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-white/70 uppercase">{tp(`name.${passType}`)}</span>
              </div>
            </div>
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{tc("valid")}</dt>
                <dd className="text-end font-medium text-ink">{validity}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{tc("location")}</dt>
                <dd className="truncate text-end font-medium text-ink">
                  {gym.address.area}, {gym.address.city}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{tc("steps.payment")}</dt>
                <dd className="text-end font-medium text-ink">{payment === "desk" ? tc("atDesk") : tc("online")}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-gray-900/15 pt-4">
                <dt className="font-semibold text-ink">{tc("total")}</dt>
                <dd className="text-2xl font-semibold tracking-tight whitespace-nowrap text-ink tabular-nums">{total}</dd>
              </div>
            </dl>
            <div className="hidden px-5 pb-5 lg:block">
              <PayButton label={cta} />
              <p className="mt-3 text-center text-xs text-gray-500">{tc("freeCancel")}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-900/[0.06] bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 shrink-0">
            <p className="text-xs text-gray-500">{tp(`name.${passType}`)}</p>
            <p className="text-lg font-semibold whitespace-nowrap text-ink tabular-nums">{total}</p>
          </div>
          <div className="min-w-0 flex-1">
            <PayButton label={payment === "desk" ? tc("reserve") : tc("payNow")} />
          </div>
        </div>
      </div>
    </form>
  );
}

function PaymentOption({ selected, onSelect, icon, title, text }: { selected: boolean; onSelect: () => void; icon: React.ReactNode; title: string; text: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-3xl p-4 text-start ring-1 transition-all duration-300 ease-out-expo",
        selected ? "bg-surface shadow-soft ring-2 ring-ink" : "bg-surface/70 ring-gray-900/[0.06] hover:ring-gray-900/15",
      )}
    >
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", selected ? "bg-volt text-ink" : "bg-canvas text-gray-600")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="block text-sm text-gray-500">{text}</span>
      </span>
      <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full ring-2", selected ? "bg-ink ring-ink" : "ring-gray-300")}>
        {selected && <span className="size-2 rounded-full bg-volt" />}
      </span>
    </button>
  );
}
