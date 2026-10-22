import Link from "next/link";
import { HiArrowUpRight, HiCheck } from "react-icons/hi2";
import { LogoMark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Accent, SectionHeading } from "./SectionHeading";

const sides = [
  {
    label: "For members",
    title: "Train anywhere, pay only for what you use.",
    points: [
      "Compare gyms by price, amenities and live crowd",
      "Book day, week or monthly passes in seconds",
      "Walk in with a QR pass on your phone",
    ],
    cta: { href: "/app/register", label: "Create a free account" },
    tone: "bg-surface",
  },
  {
    label: "For gym owners",
    title: "Fill empty hours without building any tech.",
    points: [
      "A professional listing and booking page, instantly",
      "Capacity limits, pass pricing and promotions",
      "QR check-ins, reviews and payouts in one studio",
    ],
    cta: { href: "/studio/register", label: "List your gym" },
    tone: "bg-volt-soft/70",
  },
];

export default function TwoSides() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="One network"
          title={
            <>
              Where people who train meet the gyms that <Accent>want them</Accent>
            </>
          }
          description="Fit Planet is a two-sided marketplace. Members get freedom and transparency. Gyms get demand, tools and data they never had."
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
              key={side.label}
              delay={index * 120}
              className={`group relative overflow-hidden rounded-4xl border border-gray-900/[0.06] p-7 shadow-soft sm:p-10 ${side.tone}`}
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                {side.label}
              </p>
              <h3 className="mt-4 max-w-md text-2xl leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-[2rem]">
                {side.title}
              </h3>
              <ul className="mt-8 space-y-3.5">
                {side.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-gray-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <HiCheck className="size-3" strokeWidth={1.5} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={side.cta.href}
                className="mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-ink"
              >
                <span className="bg-linear-to-r from-ink to-ink bg-[length:0%_1.5px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1.5px]">
                  {side.cta.label}
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
