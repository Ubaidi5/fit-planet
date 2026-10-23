import { useTranslations } from "next-intl";
import type { DailyPoint } from "@/server/modules/analytics";
import { formatDate } from "@/lib/dates";

/** 30-day revenue bars with booking counts on hover. Pure SVG, rendered on the server. */
export function RevenueBars({ series, format, locale }: { series: DailyPoint[]; format: (n: number) => string; locale: string }) {
  const t = useTranslations("studio.charts");
  const max = Math.max(1, ...series.map((p) => p.revenue));
  const width = 600;
  const height = 180;
  const gap = 4;
  const barWidth = (width - gap * (series.length - 1)) / series.length;
  const ticks = [0, 0.5, 1].map((t) => ({ y: height - t * height, label: format(Math.round(max * t)) }));

  return (
    <div className="relative">
      {/* Time runs left to right in every language, so the chart and its axis stay LTR */}
      <svg viewBox={`0 0 ${width} ${height + 24}`} className="h-56 w-full" preserveAspectRatio="none" role="img" aria-label={t("revenueAria")}>
        {ticks.map((t) => (
          <line key={t.y} x1="0" x2={width} y1={t.y} y2={t.y} stroke="currentColor" className="text-gray-900/[0.06]" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        {series.map((point, i) => {
          const h = point.revenue > 0 ? Math.max(3, (point.revenue / max) * (height - 8)) : 2;
          const x = i * (barWidth + gap);
          const isLast = i === series.length - 1;
          return (
            <g key={point.date}>
              <title>{t("barTitle", { date: formatDate(point.date, locale), amount: format(point.revenue), count: point.bookings })}</title>
              <rect x={x} y={height - h} width={barWidth} height={h} rx={Math.min(4, barWidth / 2)} className={isLast ? "fill-emerald-600" : point.revenue > 0 ? "fill-emerald-300" : "fill-gray-900/[0.06]"} />
            </g>
          );
        })}
      </svg>
      <div dir="ltr" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between font-mono text-[10px] tracking-[0.08em] text-gray-400 uppercase">
        <span>{formatDate(series[0].date, locale)}</span>
        <span>{formatDate(series[Math.floor(series.length / 2)].date, locale)}</span>
        <span>{t("today")}</span>
      </div>
      <div dir="ltr" className="pointer-events-none absolute top-0 right-0 flex h-[180px] flex-col justify-between py-0 text-end font-mono text-[10px] text-gray-400">
        <span className="-translate-y-1/2 rounded bg-surface/80 px-1">{ticks[2].label}</span>
      </div>
    </div>
  );
}
