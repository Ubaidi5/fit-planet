"use client";

import { HiOutlineClock } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatDate } from "@/lib/dates";
import { cityCode } from "@/lib/data/cities";
import { mockGyms, type Gym } from "@/lib/data/mock-gyms";
import { PassCard, type PassTone } from "./PassCard";
import { Stamp, type StampTone } from "./Stamp";

const slots: { tone: PassTone; pass: "day" | "week"; stamp: StampTone }[] = [
  { tone: "paper", pass: "week", stamp: "teal" },
  { tone: "mint", pass: "day", stamp: "magenta" },
  { tone: "ink", pass: "day", stamp: "violet" },
];

/** Shown until three cities have live gyms */
const sampleSlugs = ["marina-box-dubai", "urban-iron-berlin", "brick-lab-new-york"];

/** One gym per city, so the wallet reads as a trip */
function pickWallet(gyms: Gym[]) {
  const picked: Gym[] = [];
  for (const gym of gyms) {
    if (!picked.some((g) => g.address.city === gym.address.city)) picked.push(gym);
    if (picked.length === slots.length) return picked;
  }
  return sampleSlugs
    .map((slug) => mockGyms.find((g) => g.slug === slug))
    .filter((g): g is Gym => Boolean(g));
}

// Resting and fanned positions for back, middle and front pass
const positions = [
  "top-0 -rotate-6 group-hover:-translate-x-6 group-hover:-translate-y-4 group-hover:-rotate-[11deg]",
  "top-[22%] rotate-3 group-hover:translate-x-5 group-hover:-translate-y-1 group-hover:rotate-[7deg]",
  "top-[44%] -rotate-1 group-hover:translate-y-4 group-hover:rotate-0",
];

function crowdKey(pct: number) {
  return pct >= 80 ? "busy" : pct >= 50 ? "moderate" : "quiet";
}

/** The hero's fanned wallet of passes from three cities, with stamps behind */
export function PassWallet({ gyms, className }: { gyms: Gym[]; className?: string }) {
  const { money, clock, region } = useLocale();
  const t = useTranslations("heroWallet");
  const tp = useTranslations("passes.name");
  const wallet = pickWallet(gyms).map((gym, index) => ({ gym, ...slots[index] }));
  const front = wallet[wallet.length - 1]?.gym;
  // A fixed past date keeps server and client output identical
  const stampDate = formatDate("2026-09-12", region.locale);
  const frontPct = front ? Math.round((front.capacity.current / front.capacity.max) * 100) : 0;

  return (
    <div className={cn("group relative mx-auto aspect-[4/4.3] w-full max-w-[25rem] sm:aspect-[4/4]", className)}>
      {/* Stamps */}
      {wallet[0] && (
        <Stamp code={cityCode(wallet[0].gym.address.city)} label={wallet[0].gym.address.city} date={stampDate} tone={wallet[0].stamp} rotate={-14} size="md" className="absolute -top-4 -end-2 animate-fade-up [animation-delay:700ms] sm:-end-10" />
      )}
      {wallet[1] && (
        <Stamp code={cityCode(wallet[1].gym.address.city)} label={wallet[1].gym.address.city} tone={wallet[1].stamp} shape="rect" rotate={9} size="sm" className="absolute top-[38%] -start-3 animate-fade-up [animation-delay:820ms] sm:-start-12" />
      )}
      {wallet[2] && (
        <Stamp code={cityCode(wallet[2].gym.address.city)} label={wallet[2].gym.address.city} date={t("today")} tone={wallet[2].stamp} shape="dashed" rotate={12} size="sm" className="absolute -bottom-2 -end-1 animate-fade-up [animation-delay:940ms] sm:-end-8" />
      )}

      {wallet.map(({ gym, tone, pass }, index) => (
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
              passType={tp(pass)}
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
            <p className="text-[13px] font-semibold text-ink">{t(`crowd.${crowdKey(frontPct)}`)}</p>
            <p className="flex items-center gap-1 text-[11px] text-gray-500">
              <HiOutlineClock className="size-3" />
              {front.hours.is24Hours ? t("open24", { gym: front.name }) : t("opens", { gym: front.name, time: clock(front.hours.open) })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
