"use client";

import { useState } from "react";
import { HiArrowRight, HiOutlineShieldCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cityCode } from "@/lib/data/cities";
import type { Gym } from "@/lib/data/mock-gyms";
import { FauxQR } from "@/components/brand/FauxQR";
import { passPlans, type PassKey } from "./PassTickets";

interface BookingTicketProps {
  gym: Gym;
  annualPass?: number;
  onBook: (pass: PassKey) => void;
  className?: string;
}

/** Sidebar booking card drawn as a pass: pick a pass, see the price, book */
export function BookingTicket({ gym, annualPass, onBook, className }: BookingTicketProps) {
  const { money } = useLocale();
  const plans = passPlans(gym, annualPass).filter((plan) => plan.key !== "annual");
  const [selected, setSelected] = useState<PassKey>("day");
  const plan = plans.find((p) => p.key === selected) ?? plans[0];

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-surface shadow-lift ring-1 ring-gray-900/[0.06]", className)}>
      {/* Header */}
      <div className="relative bg-ink p-6 text-white">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-white/55 uppercase">
          <span>
            {cityCode(gym.address.city)} · {gym.country}
          </span>
          <span>Boarding pass</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold tracking-[-0.02em]">{gym.name}</p>
            <p className="mt-1 truncate text-sm text-white/60">{gym.address.area}</p>
          </div>
          <span className="shrink-0 rounded-xl bg-white p-1.5">
            <FauxQR seed={gym.slug} size={48} />
          </span>
        </div>
        <div aria-hidden="true" className="mt-5 h-1.5 rounded-full bg-holo" />
      </div>

      {/* Perforation */}
      <div aria-hidden="true" className="relative h-0">
        <span className="absolute -top-3 -start-3 size-6 rounded-full bg-canvas" />
        <span className="absolute -top-3 -end-3 size-6 rounded-full bg-canvas" />
      </div>

      <div className="p-6">
        <fieldset>
          <legend className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Choose a pass</legend>
          <div className="mt-3 space-y-2">
            {plans.map((option) => {
              const active = option.key === selected;
              return (
                <label
                  key={option.key}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition-all duration-300",
                    active ? "bg-volt-soft ring-2 ring-ink" : "bg-canvas/60 ring-gray-900/[0.06] hover:ring-gray-900/15",
                  )}
                >
                  <input
                    type="radio"
                    name="booking-pass"
                    value={option.key}
                    checked={active}
                    onChange={() => setSelected(option.key)}
                    className="sr-only"
                  />
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4.5 shrink-0 items-center justify-center rounded-full ring-2 transition-colors",
                        active ? "bg-ink ring-ink" : "ring-gray-300",
                      )}
                    >
                      {active && <span className="size-1.5 rounded-full bg-volt" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{option.name}</span>
                      <span className="block font-mono text-[10px] tracking-[0.1em] text-gray-400 uppercase">{option.duration}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[15px] font-semibold whitespace-nowrap text-ink tabular-nums">
                    {money(option.price, gym.currency)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-gray-900/15 pt-4">
          <span className="text-sm text-gray-500">Total today</span>
          <span className="text-2xl font-semibold tracking-tight whitespace-nowrap text-ink tabular-nums">
            {money(plan.price, gym.currency)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onBook(selected)}
          className="group mt-5 inline-flex h-13 w-full items-center justify-between rounded-full bg-ink ps-6 pe-1.5 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
        >
          Book {plan.name.toLowerCase()}
          <span className="flex size-10 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 rtl:rotate-180">
            <HiArrowRight className="size-4.5" />
          </span>
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <HiOutlineShieldCheck className="size-4 text-emerald-600" />
          Instant QR pass · Priced in {gym.currency}
        </p>
      </div>
    </div>
  );
}
