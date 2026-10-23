import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Average check-ins by hour as a heat strip, to spot peak hours at a glance */
export function HourlyStrip({ hourly, currentHour }: { hourly: number[]; currentHour: number }) {
  const t = useTranslations("studio.charts");
  const max = Math.max(0.1, ...hourly);
  const peak = hourly.indexOf(Math.max(...hourly));
  return (
    <div>
      <div className="grid grid-cols-24 gap-[3px]">
        {hourly.map((value, hour) => {
          const level = value / max;
          return (
            <div
              key={hour}
              title={t("hourTitle", { hour: `${String(hour).padStart(2, "0")}:00`, value })}
              className={cn("h-12 rounded-[4px]", hour === currentHour && "ring-2 ring-ink ring-offset-1 ring-offset-surface")}
              style={{ backgroundColor: value === 0 ? "var(--color-gray-100)" : `color-mix(in oklch, var(--color-emerald-500) ${Math.round(20 + level * 80)}%, var(--color-surface))` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-gray-400">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
      {hourly.some((v) => v > 0) && (
        <p className="mt-3 text-sm text-gray-600">
          {t.rich("busiest", { hour: `${String(peak).padStart(2, "0")}:00`, b: (chunks) => <span className="font-semibold text-ink">{chunks}</span> })}
        </p>
      )}
    </div>
  );
}
