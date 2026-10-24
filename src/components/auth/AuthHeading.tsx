export function AuthHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[11px] tracking-[0.16em] text-gray-400 uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{subtitle}</p>}
    </div>
  );
}
