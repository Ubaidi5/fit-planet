import { cn } from "@/lib/utils";
import { FauxQR } from "@/components/brand/FauxQR";

export type PassTone = "ink" | "paper" | "mint";

export interface PassCardProps {
  cityCode: string;
  country: string;
  gymName: string;
  passType: string;
  price?: string;
  meta?: string;
  tone?: PassTone;
  showQr?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const toneClass: Record<PassTone, string> = {
  ink: "bg-ink text-white",
  paper: "bg-surface text-ink",
  mint: "bg-volt-soft text-ink",
};

/**
 * A digital gym pass drawn like a boarding pass: route code, gym, pass type,
 * a perforated stub and a QR on the active (ink) pass.
 */
export function PassCard({
  cityCode,
  country,
  gymName,
  passType,
  price,
  meta,
  tone = "paper",
  showQr = tone === "ink",
  className,
  style,
}: PassCardProps) {
  const muted = tone === "ink" ? "text-white/65" : "text-gray-500";

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-[1.6rem] shadow-pass ring-1 ring-gray-900/[0.06]",
        toneClass[tone],
        className,
      )}
      style={style}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-5 sm:p-6">
        <div className={cn("flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase", muted)}>
          <span>
            {cityCode} · {country}
          </span>
          <span>{passType}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[1.45rem] leading-tight font-semibold tracking-[-0.03em]">{gymName}</p>
          {(price || meta) && (
            <p className={cn("mt-1.5 truncate font-mono text-[11px] tracking-[0.1em] uppercase", muted)}>
              {[price, meta].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {tone === "ink" && <div aria-hidden="true" className="h-1.5 rounded-full bg-holo" />}
      </div>

      {showQr && (
        <div className="relative flex w-28 shrink-0 items-center justify-center bg-white sm:w-32">
          {/* Perforation */}
          <span aria-hidden="true" className="absolute inset-y-3 start-0 border-s-2 border-dashed border-ink/25" />
          <span aria-hidden="true" className="absolute -top-3 -start-3 size-6 rounded-full bg-canvas" />
          <span aria-hidden="true" className="absolute -bottom-3 -start-3 size-6 rounded-full bg-canvas" />
          <FauxQR seed={`${cityCode}-${gymName}`} size={76} />
        </div>
      )}
    </div>
  );
}
