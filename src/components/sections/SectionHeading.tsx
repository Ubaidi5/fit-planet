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
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <p
        className={cn(
          "inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-700",
        )}
      >
        <span className="h-px w-6 bg-emerald-600/40" />
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

/** Serif italic accent used inside headings */
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-serif font-normal tracking-[-0.01em] text-emerald-700 italic">
      {children}
    </span>
  );
}
