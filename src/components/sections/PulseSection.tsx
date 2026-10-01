"use client";

import { useState } from "react";
import { HiOutlineBellAlert, HiOutlineChartBar, HiOutlineClock } from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { CrowdCurve } from "@/components/pulse/CrowdCurve";
import { cn } from "@/lib/utils";
import { cityCode } from "@/lib/data/cities";
import { mockGyms } from "@/lib/data/mock-gyms";
import { Accent, SectionHeading } from "./SectionHeading";

const featured = ["marina-box-dubai", "fitzone-karachi", "southbank-strength-london"]
  .map((slug) => mockGyms.find((g) => g.slug === slug))
  .filter((g): g is (typeof mockGyms)[number] => Boolean(g));

const points = [
  { icon: HiOutlineChartBar, title: "Live crowd", text: "Every gym reports how full it is as members check in." },
  { icon: HiOutlineClock, title: "Hourly forecast", text: "See the quiet windows for today in the gym's own time zone." },
  { icon: HiOutlineBellAlert, title: "Quiet alerts", text: "Get a nudge when your favourite gym drops below half full." },
];

export default function PulseSection() {
  const [active, setActive] = useState(featured[0]?.slug);
  const gym = featured.find((g) => g.slug === active) ?? featured[0];
  if (!gym) return null;
  const pct = Math.round((gym.capacity.current / gym.capacity.max) * 100);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Pulse · crowd forecast"
            title={
              <>
                Skip the queue for <Accent>the squat rack</Accent>
              </>
            }
            description="Fit Planet shows how busy a gym is before you leave home, wherever home is this week."
            className="mx-auto text-center lg:mx-0 lg:text-start"
          />
          <ul className="mt-10 space-y-5">
            {points.map(({ icon: Icon, title, text }, index) => (
              <Reveal as="li" key={title} delay={index * 80} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-emerald-700 shadow-soft ring-1 ring-gray-900/[0.05]">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="mt-0.5 block text-[15px] leading-relaxed text-gray-600">{text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={120} className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift sm:p-8">
          <div role="tablist" aria-label="Choose a gym" className="flex gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 no-scrollbar">
            {featured.map((g) => (
              <button
                key={g.slug}
                type="button"
                role="tab"
                aria-selected={g.slug === gym.slug}
                onClick={() => setActive(g.slug)}
                className={cn(
                  "flex h-9 min-w-0 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-medium whitespace-nowrap transition-all duration-300",
                  g.slug === gym.slug ? "bg-surface text-ink shadow-soft" : "text-gray-500 hover:text-ink",
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.1em] text-gray-400">{cityCode(g.address.city)}</span>
                {g.address.city}
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">{gym.name}</p>
              <p className="mt-0.5 truncate text-sm text-gray-500">{gym.address.area}, {gym.address.city}</p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{pct}%</p>
              <p className="font-mono text-[11px] tracking-[0.08em] text-gray-500 uppercase">full now</p>
            </div>
          </div>

          <CrowdCurve key={gym.slug} gym={gym} className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
