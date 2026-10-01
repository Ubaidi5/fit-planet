import { cn } from "@/lib/utils";

type StampTone = "teal" | "magenta" | "ochre" | "violet";
type StampShape = "circle" | "rect" | "dashed";

interface StampProps {
  code: string;
  label?: string;
  date?: string;
  tone?: StampTone;
  shape?: StampShape;
  rotate?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const toneClass: Record<StampTone, string> = {
  teal: "text-stamp-teal",
  magenta: "text-stamp-magenta",
  ochre: "text-stamp-ochre",
  violet: "text-stamp-violet",
};

const sizeClass = {
  sm: { box: "size-16", rect: "h-12 w-16", code: "text-[11px]", sub: "text-[8px]" },
  md: { box: "size-28", rect: "h-20 w-28", code: "text-[15px]", sub: "text-[10px]" },
  lg: { box: "size-36", rect: "h-24 w-36", code: "text-lg", sub: "text-[11px]" },
};

/** Ink-stamp mark for a city visited, drawn with borders so it stays crisp */
export function Stamp({
  code,
  label,
  date,
  tone = "teal",
  shape = "circle",
  rotate = -8,
  size = "md",
  className,
  style,
}: StampProps) {
  const s = sizeClass[size];
  return (
    <div
      aria-label={[code, label, date].filter(Boolean).join(", ")}
      className={cn(
        "relative flex shrink-0 flex-col items-center justify-center text-center font-mono leading-tight uppercase opacity-90 mix-blend-multiply select-none",
        toneClass[tone],
        shape === "rect" ? cn(s.rect, "rounded-xl border-[3px] border-current") : s.box,
        shape === "circle" && "rounded-full border-[3px] border-current",
        shape === "dashed" && "rounded-full border-[3px] border-dashed border-current",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {shape !== "rect" && (
        <span aria-hidden="true" className="absolute inset-1.5 rounded-full border border-current opacity-60" />
      )}
      <span className={cn("font-semibold tracking-[0.12em]", s.code)}>{code}</span>
      {label && <span className={cn("max-w-[85%] truncate tracking-[0.1em]", s.sub)}>{label}</span>}
      {date && <span className={cn("tracking-[0.1em]", s.sub)}>{date}</span>}
    </div>
  );
}
