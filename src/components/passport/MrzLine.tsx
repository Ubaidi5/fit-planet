import { cn } from "@/lib/utils";

/** Passport machine-readable-zone style line, used as a decorative eyebrow */
export function MrzLine({ text, className }: { text: string; className?: string }) {
  const encoded = `P<${text.toUpperCase().replace(/[^A-Z0-9]+/g, "<")}`.padEnd(44, "<");
  return (
    <p
      aria-hidden="true"
      className={cn("font-mono text-[12px] tracking-[0.14em] whitespace-nowrap text-emerald-700 select-none", className)}
    >
      {encoded}
    </p>
  );
}
