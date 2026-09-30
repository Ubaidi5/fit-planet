import { cn } from "@/lib/utils";
import { HiArrowTrendingUp } from "react-icons/hi2";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  trend?: "up" | "down" | "flat";
  spark?: number[];
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / range) * 24}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-10 w-24" aria-hidden="true">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-emerald-400)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-emerald-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${points} 100,30`} fill="url(#spark-fill)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-emerald-600)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  trend = "flat",
  spark,
  icon,
  className,
  style,
}: StatCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "group rounded-3xl border border-gray-900/[0.06] bg-surface p-5 shadow-soft transition-shadow duration-500 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-xl bg-canvas text-gray-600 ring-1 ring-gray-900/[0.05]">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[1.75rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
            {value}
          </p>
          {(delta || deltaLabel) && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
              {delta && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                    trend === "up" && "bg-emerald-50 text-emerald-700",
                    trend === "down" && "bg-red-50 text-red-700",
                    trend === "flat" && "bg-gray-900/5 text-gray-700",
                  )}
                >
                  {trend === "up" && <HiArrowTrendingUp className="size-3" />}
                  {delta}
                </span>
              )}
              {deltaLabel}
            </p>
          )}
        </div>
        {spark && <Sparkline values={spark} />}
      </div>
    </div>
  );
}
