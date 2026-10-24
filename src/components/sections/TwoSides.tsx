import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HiArrowUpRight, HiCheck } from "react-icons/hi2";
import { LogoMark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Accent, SectionHeading } from "./SectionHeading";

const sides = [
  { key: "members", points: ["compare", "book", "walkIn"], href: "/app/register", tone: "bg-surface" },
  { key: "owners", points: ["listing", "capacity", "studio"], href: "/studio/register", tone: "bg-volt-soft/70" },
];

export default async function TwoSides() {
  const t = await getTranslations("twoSides");
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t.rich("title", { accent: (c) => <Accent>{c}</Accent> })}
          description={t("lead")}
        />

        <div className="relative mt-16 grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Connector node */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-emerald-400/40" />
            <LogoMark className="size-14 rounded-2xl ring-8 ring-canvas" />
          </div>

          {sides.map((side, index) => (
            <Reveal
              key={side.key}
              delay={index * 120}
              className={`group relative overflow-hidden rounded-4xl border border-gray-900/[0.06] p-7 shadow-soft sm:p-10 ${side.tone}`}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                {t(`${side.key}.label`)}
              </p>
              <h3 className="mt-4 max-w-md text-2xl leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-[2rem]">
                {t(`${side.key}.title`)}
              </h3>
              <ul className="mt-8 space-y-3.5">
                {side.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-gray-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <HiCheck className="size-3" strokeWidth={1.5} />
                    </span>
                    {t(`${side.key}.points.${point}`)}
                  </li>
                ))}
              </ul>
              <Link
                href={side.href}
                className="mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-ink"
              >
                <span className="bg-linear-to-r from-ink to-ink bg-[length:0%_1.5px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1.5px]">
                  {t(`${side.key}.cta`)}
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                  <HiArrowUpRight className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
