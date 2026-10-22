"use client";

import { HiOutlineClock } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cityCode } from "@/lib/data/cities";
import { mockGyms, type Gym } from "@/lib/data/mock-gyms";
import { PassCard, type PassTone } from "./PassCard";
import { Stamp } from "./Stamp";

const walletSlugs: { slug: string; tone: PassTone; passType: string }[] = [
  { slug: "fitzone-karachi", tone: "paper", passType: "Week pass" },
  { slug: "urban-iron-berlin", tone: "mint", passType: "Day pass" },
  { slug: "iron-shrine-tokyo", tone: "ink", passType: "Day pass" },
];

const wallet = walletSlugs
  .map((entry) => ({ ...entry, gym: mockGyms.find((g) => g.slug === entry.slug) }))
  .filter((entry): entry is typeof entry & { gym: Gym } => Boolean(entry.gym));

// Resting and fanned positions for back, middle and front pass
const positions = [
  "top-0 -rotate-6 group-hover:-translate-x-6 group-hover:-translate-y-4 group-hover:-rotate-[11deg]",
  "top-[22%] rotate-3 group-hover:translate-x-5 group-hover:-translate-y-1 group-hover:rotate-[7deg]",
  "top-[44%] -rotate-1 group-hover:translate-y-4 group-hover:rotate-0",
];

/** The hero's fanned wallet of passes from three cities, with stamps behind */
export function PassWallet({ className }: { className?: string }) {
  const { money, clock } = useLocale();
  const front = wallet[wallet.length - 1]?.gym;
  const frontPct = front ? Math.round((front.capacity.current / front.capacity.max) * 100) : 0;

  return (
    <div className={cn("group relative mx-auto aspect-[4/4.3] w-full max-w-[25rem] sm:aspect-[4/4]", className)}>
      {/* Stamps */}
      <Stamp code="KHI" label="Karachi" date="12 Sep" tone="teal" rotate={-14} size="md" className="absolute -top-4 -end-2 animate-fade-up [animation-delay:700ms] sm:-end-10" />
      <Stamp code="BER" label="Berlin" tone="magenta" shape="rect" rotate={9} size="sm" className="absolute top-[38%] -start-3 animate-fade-up [animation-delay:820ms] sm:-start-12" />
      <Stamp code="TYO" label="Tokyo" date="Today" tone="violet" shape="dashed" rotate={12} size="sm" className="absolute -bottom-2 -end-1 animate-fade-up [animation-delay:940ms] sm:-end-8" />

      {wallet.map(({ gym, tone, passType }, index) => (
        <div
          key={gym.id}
          className={cn(
            "absolute inset-x-0 transition-transform duration-700 ease-out-expo",
            positions[index],
          )}
          style={{ zIndex: index + 1 }}
        >
          <div className="animate-fade-up" style={{ animationDelay: `${200 + index * 140}ms` }}>
            <PassCard
              cityCode={cityCode(gym.address.city)}
              country={gym.country}
              gymName={gym.name}
              passType={passType}
              price={money(gym.pricing.dayPass, gym.currency)}
              meta={gym.address.area}
              tone={tone}
            />
          </div>
        </div>
      ))}

      {/* Live crowd chip */}
      {front && (
        <div className="absolute -bottom-6 start-2 z-10 flex animate-float items-center gap-3 rounded-2xl border border-gray-900/[0.06] bg-surface/95 py-2.5 ps-2.5 pe-4 shadow-lift backdrop-blur sm:-start-8">
          <span
            className="flex size-10 items-center justify-center rounded-full p-[3px]"
            style={{ background: `conic-gradient(var(--color-stamp-teal) 0 ${frontPct}%, var(--color-gray-200) 0)` }}
          >
            <span className="flex size-full items-center justify-center rounded-full bg-surface font-mono text-[10px] font-semibold text-ink">
              {frontPct}%
            </span>
          </span>
          <div>
            <p className="text-[13px] font-semibold text-ink">Quiet right now</p>
            <p className="flex items-center gap-1 text-[11px] text-gray-500">
              <HiOutlineClock className="size-3" />
              {front.name} · opens {clock(front.hours.open)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
