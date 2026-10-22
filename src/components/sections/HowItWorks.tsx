import Link from "next/link";
import {
  HiArrowRight,
  HiOutlineCreditCard,
  HiOutlineMagnifyingGlass,
  HiOutlineQrCode,
  HiOutlineTicket,
} from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { platformStats } from "@/lib/data/mock-platform";
import { Accent, SectionHeading } from "./SectionHeading";

const steps = [
  {
    title: "Search for gyms",
    description:
      "Pick a city or use your location. Filter by price, amenities, rating and how busy it is right now.",
    icon: HiOutlineMagnifyingGlass,
    meta: `${platformStats.cities.length} cities · ${platformStats.partnerGyms} gyms`,
  },
  {
    title: "Choose your pass",
    description:
      "Day, week or monthly. Compare what each gym offers and pick what fits your week, not a year-long contract.",
    icon: HiOutlineTicket,
    meta: "Priced in local currency",
  },
  {
    title: "Book and pay online",
    description:
      "Secure checkout with instant confirmation. Add-ons like a trainer session or locker in one tap.",
    icon: HiOutlineCreditCard,
    meta: "Confirmed in under a minute",
  },
  {
    title: "Show your QR and train",
    description:
      "Your pass lives in the app. The gym scans it at the door and you are in. That is the whole process.",
    icon: HiOutlineQrCode,
    meta: "No card, no paperwork",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title={
              <>
                From couch to squat rack in <Accent>four steps</Accent>
              </>
            }
            description="We removed every step that made joining a gym painful. What is left takes about a minute."
            className="mx-auto text-center lg:mx-0 lg:text-start"
          />
          <Reveal delay={120} className="mt-8 flex justify-center lg:justify-start">
            <Link
              href="/gyms"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pe-1.5 ps-6 text-[15px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              Find a gym now
              <span className="flex size-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                <HiArrowRight className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>

        <ol className="relative space-y-4">
          <span
            aria-hidden="true"
            className="absolute top-8 bottom-8 left-10 w-px bg-linear-to-b from-emerald-300 via-gray-300 to-transparent sm:left-13"
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 90}
                className="group relative flex gap-5 rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift sm:gap-7 sm:p-7"
              >
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-canvas text-emerald-700 ring-1 ring-gray-900/[0.06] transition-colors duration-500 group-hover:bg-ink group-hover:text-volt sm:size-12">
                  <Icon className="size-5" />
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      {step.title}
                    </h3>
                    <span className="font-mono text-sm tracking-[0.14em] text-gray-400 tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                  <p className="mt-4 inline-flex rounded-full bg-canvas px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-900/[0.05]">
                    {step.meta}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
