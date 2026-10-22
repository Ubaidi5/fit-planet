import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className,
      )}
    >
      <p className="inline-flex items-center gap-2 font-mono text-[12px] font-medium tracking-[0.16em] text-emerald-700 uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-600" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-ink text-balance-safe sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-gray-600">{description}</p>
      )}
    </Reveal>
  );
}

/** Mint marker highlight used inside headings; wraps cleanly across lines */
export function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "box-decoration-clone bg-[linear-gradient(transparent_56%,var(--color-volt)_56%,var(--color-volt)_92%,transparent_92%)] px-[0.06em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
