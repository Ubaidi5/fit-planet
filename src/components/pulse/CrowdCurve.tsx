"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { crowdForecast, quietestHours } from "@/lib/data/crowd";
import type { Gym } from "@/lib/data/mock-gyms";

interface CrowdCurveProps {
  gym: Pick<Gym, "slug" | "hours" | "timezone">;
  /** Dark variant for ink surfaces */
  tone?: "light" | "dark";
  className?: string;
}

function hourIn(timeZone: string) {
  const value = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone }).format(new Date());
  return Number(value) % 24;
}

function barColor(value: number) {
  if (value >= 75) return "bg-stamp-magenta";
  if (value >= 50) return "bg-stamp-ochre";
  return "bg-emerald-500";
}

const pad = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

/** Hourly crowd forecast for a gym, with the current hour in the gym's own timezone */
export function CrowdCurve({ gym, tone = "light", className }: CrowdCurveProps) {
  const { clock } = useLocale();
  const forecast = useMemo(() => crowdForecast(gym), [gym]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(hourIn(gym.timezone));
    const timer = window.setInterval(() => setNow(hourIn(gym.timezone)), 60_000);
    return () => window.clearInterval(timer);
  }, [gym.timezone]);

  const firstHour = gym.hours.is24Hours ? 0 : Math.max(0, Number(gym.hours.open.split(":")[0]));
  const hours = forecast.map((value, hour) => ({ hour, value })).filter(({ hour }) => hour >= Math.min(firstHour, 5));
  const best = quietestHours(forecast, now ?? firstHour);
  const dark = tone === "dark";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-36 items-end gap-[3px] sm:h-40 sm:gap-1" role="img" aria-label="Expected crowd by hour">
        {hours.map(({ hour, value }) => {
          const isNow = hour === now;
          const isBest = best.some((b) => b.hour === hour);
          return (
            <div key={hour} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              {isNow && (
                <span className={cn("absolute -top-1 rounded-full px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] uppercase", dark ? "bg-volt text-ink" : "bg-ink text-white")}>
                  Now
                </span>
              )}
              <span
                className={cn(
                  "w-full rounded-t-[4px] rounded-b-[2px] transition-all duration-500 ease-out-expo",
                  value === 0 ? (dark ? "bg-white/10" : "bg-gray-200") : barColor(value),
                  !isNow && value > 0 && "opacity-75 group-hover:opacity-100",
                  isBest && "ring-2 ring-offset-2 ring-emerald-500/40",
                  isBest && (dark ? "ring-offset-ink" : "ring-offset-surface"),
                )}
                style={{ height: `${Math.max(value, 3)}%` }}
              />
              <span
                className={cn(
                  "pointer-events-none absolute bottom-full mb-2 hidden rounded-md px-1.5 py-1 font-mono text-[10px] whitespace-nowrap group-hover:block",
                  dark ? "bg-white text-ink" : "bg-ink text-white",
                )}
              >
                {clock(pad(hour))} · {value}%
              </span>
            </div>
          );
        })}
      </div>
      <div className={cn("mt-2 flex justify-between font-mono text-[10px] tracking-[0.06em]", dark ? "text-white/40" : "text-gray-400")}>
        {hours
          .filter((_, index) => index % 6 === 0)
          .map(({ hour }) => (
            <span key={hour}>{clock(pad(hour))}</span>
          ))}
      </div>
      {best.length > 0 && (
        <p className={cn("mt-4 text-sm", dark ? "text-white/70" : "text-gray-600")}>
          Quietest {now === null ? "today" : "later today"}:{" "}
          <span className={cn("font-mono font-medium", dark ? "text-volt" : "text-emerald-700")}>
            {best.map((b) => clock(pad(b.hour))).join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}
