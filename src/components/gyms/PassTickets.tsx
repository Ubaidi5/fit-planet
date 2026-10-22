"use client";

import { HiArrowRight, HiCheck, HiOutlineSparkles } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cityCode } from "@/lib/data/cities";
import type { Gym } from "@/lib/data/mock-gyms";

export type PassKey = "day" | "week" | "month" | "annual";

export interface PassPlan {
  key: PassKey;
  name: string;
  price: number;
  duration: string;
  popular?: boolean;
  features: string[];
}

interface SpecialPackage {
  name: string;
  price: number;
  description: string;
  features: string[];
}

/** Standard passes for a gym, in its own currency */
export function passPlans(gym: Pick<Gym, "pricing">, annualPass?: number): PassPlan[] {
  const plans: PassPlan[] = [
    { key: "day", name: "Day pass", price: gym.pricing.dayPass, duration: "1 day", features: ["Full gym access", "All equipment", "Locker"] },
    { key: "week", name: "Week pass", price: gym.pricing.weekPass, duration: "7 days", features: ["Full gym access", "All equipment", "Locker", "1 group class"] },
    {
      key: "month",
      name: "Month pass",
      price: gym.pricing.monthPass,
      duration: "30 days",
      popular: true,
      features: ["Full gym access", "Unlimited classes", "Locker", "Towel service"],
    },
  ];
  if (annualPass) {
    plans.push({
      key: "annual",
      name: "Annual pass",
      price: annualPass,
      duration: "12 months",
      features: ["Everything in Month", "2 PT sessions a month", "2 guest passes a month"],
    });
  }
  return plans;
}

interface PassTicketsProps {
  gym: Gym;
  annualPass?: number;
  specialPackages?: SpecialPackage[];
  onSelect?: (pass: PassKey) => void;
}

/** Passes drawn as boarding-pass tickets: details on the left, price stub on the right */
export function PassTickets({ gym, annualPass, specialPackages, onSelect }: PassTicketsProps) {
  const { money } = useLocale();
  const plans = passPlans(gym, annualPass);
  const code = cityCode(gym.address.city);

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const ink = plan.popular;
        return (
          <article
            key={plan.key}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-[1.75rem] ring-1 transition-shadow duration-500 sm:flex-row",
              ink ? "bg-ink text-white shadow-pass ring-ink" : "bg-surface text-ink shadow-soft ring-gray-900/[0.06] hover:shadow-lift",
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
              <div className={cn("flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase", ink ? "text-white/60" : "text-gray-400")}>
                <span>
                  {code} · {gym.country}
                </span>
                <span aria-hidden="true">·</span>
                <span>{plan.duration}</span>
                {plan.popular && (
                  <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-volt px-2.5 py-1 tracking-[0.1em] text-ink">
                    <HiOutlineSparkles className="size-3.5" />
                    Most popular
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className={cn("flex items-center gap-1.5 text-sm", ink ? "text-white/80" : "text-gray-600")}>
                    <HiCheck className={cn("size-4 shrink-0", ink ? "text-volt" : "text-emerald-600")} />
                    {feature}
                  </li>
                ))}
              </ul>
              {ink && <div aria-hidden="true" className="h-1.5 rounded-full bg-holo" />}
            </div>

            {/* Stub */}
            <div
              className={cn(
                "relative flex shrink-0 flex-row items-center justify-between gap-4 border-t-2 border-dashed p-5 sm:w-60 sm:flex-col sm:items-stretch sm:justify-center sm:border-s-2 sm:border-t-0 sm:p-6",
                ink ? "border-white/20" : "border-gray-900/10 bg-canvas/50",
              )}
            >
              <span aria-hidden="true" className="absolute -top-3 -start-3 hidden size-6 rounded-full bg-canvas sm:block" />
              <span aria-hidden="true" className="absolute -bottom-3 -start-3 hidden size-6 rounded-full bg-canvas sm:block" />
              <div className="min-w-0">
                <p className="text-[1.75rem] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap tabular-nums">
                  {money(plan.price, gym.currency)}
                </p>
                <p className={cn("mt-1.5 font-mono text-[11px] tracking-[0.1em] uppercase", ink ? "text-white/50" : "text-gray-400")}>
                  {plan.duration}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelect?.(plan.key)}
                className={cn(
                  "group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors sm:mt-5",
                  ink ? "bg-volt text-ink hover:bg-white" : "bg-ink text-white hover:bg-gray-800",
                )}
              >
                Choose
                <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </button>
            </div>
          </article>
        );
      })}

      {specialPackages && specialPackages.length > 0 && (
        <div className="pt-6">
          <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">Special packages</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {specialPackages.map((pkg) => (
              <article key={pkg.name} className="flex flex-col rounded-3xl border border-dashed border-stamp-violet/30 bg-surface p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-ink">{pkg.name}</h4>
                  <p className="shrink-0 text-end">
                    <span className="block text-lg font-semibold whitespace-nowrap text-ink tabular-nums">{money(pkg.price, gym.currency)}</span>
                    <span className="font-mono text-[10px] tracking-[0.1em] text-gray-400 uppercase">per month</span>
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{pkg.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <HiCheck className="size-4 shrink-0 text-stamp-violet" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => onSelect?.("month")}
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-surface text-sm font-medium text-ink ring-1 ring-gray-900/10 transition-colors hover:bg-gray-100"
                >
                  Get this package
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
