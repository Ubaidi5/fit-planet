import { useTranslations } from "next-intl";

/** Live occupancy as a ring, coloured by how full the gym is */
export function OccupancyRing({ current, max, size = 132 }: { current: number; max: number; size?: number }) {
  const t = useTranslations("studio.charts");
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const r = 52;
  const c = 2 * Math.PI * r;
  const color = pct >= 80 ? "var(--color-stamp-magenta)" : pct >= 50 ? "var(--color-stamp-ochre)" : "var(--color-stamp-teal)";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-gray-100)" strokeWidth="12" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{pct}%</span>
        <span className="text-xs text-gray-500">{t("full")}</span>
      </div>
    </div>
  );
}
