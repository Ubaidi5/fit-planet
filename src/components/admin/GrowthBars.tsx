import type { GrowthPoint } from "@/server/modules/admin";

const day = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" });
const label = (date: string) => day.format(new Date(`${date}T00:00:00Z`));

/** Paired daily bars, sign-ups and passes, for the last 30 days. Pure SVG, rendered on the server. */
export function GrowthBars({ series }: { series: GrowthPoint[] }) {
  const max = Math.max(1, ...series.flatMap((p) => [p.signups, p.bookings]));
  const width = 600;
  const height = 160;
  const slot = width / series.length;
  const bar = Math.max(2, (slot - 4) / 2);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" preserveAspectRatio="none" role="img" aria-label="Sign-ups and passes per day, last 30 days">
        {[0.5, 1].map((t) => (
          <line key={t} x1="0" x2={width} y1={height - t * (height - 6)} y2={height - t * (height - 6)} stroke="currentColor" className="text-gray-900/[0.06]" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        {series.map((p, i) => {
          const x = i * slot + 1;
          const hs = p.signups ? Math.max(3, (p.signups / max) * (height - 6)) : 2;
          const hb = p.bookings ? Math.max(3, (p.bookings / max) * (height - 6)) : 2;
          return (
            <g key={p.date}>
              <title>{`${label(p.date)}: ${p.signups} sign-ups, ${p.bookings} passes`}</title>
              <rect x={x} y={height - hs} width={bar} height={hs} rx={Math.min(3, bar / 2)} className={p.signups ? "fill-sky-400" : "fill-gray-900/[0.06]"} />
              <rect x={x + bar + 1} y={height - hb} width={bar} height={hb} rx={Math.min(3, bar / 2)} className={p.bookings ? "fill-emerald-500" : "fill-gray-900/[0.06]"} />
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.08em] text-gray-400 uppercase">
        <span>{label(series[0].date)}</span>
        <span>{label(series[Math.floor(series.length / 2)].date)}</span>
        <span>Today</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-gray-600">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-sky-400" /> Sign-ups · {series.reduce((n, p) => n + p.signups, 0)}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500" /> Passes · {series.reduce((n, p) => n + p.bookings, 0)}
        </span>
      </div>
    </div>
  );
}
