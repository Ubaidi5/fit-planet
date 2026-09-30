import Link from "next/link";
import {
  HiArrowRight,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";

const assurances = [
  { icon: HiOutlineShieldCheck, label: "Secure payments" },
  { icon: HiOutlineSparkles, label: "Free for members" },
  { icon: HiOutlineBuildingStorefront, label: "Verified gyms only" },
];

const CTA: React.FC = () => {
  return (
    <section className="px-3 py-24 sm:px-4 lg:py-32">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-gray-900/[0.06] bg-surface px-6 py-16 text-center shadow-soft sm:px-12 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-volt/35 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 size-96 animate-blob rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="absolute -right-20 -bottom-32 size-80 animate-blob rounded-full bg-emerald-200/40 blur-3xl [animation-delay:-8s]" />
          <div className="absolute inset-0 bg-grain opacity-[0.12] mix-blend-multiply" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.04em] text-ink text-balance-safe sm:text-6xl">
            Your next workout is{" "}
            <span className="font-serif font-normal italic">one search</span> away
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Join the members already training across Karachi, or bring your gym
            onto the network and start taking bookings this week.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/gyms"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink pr-2 pl-7 text-base font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto"
            >
              Find gyms near you
              <span className="flex size-10 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                <HiArrowRight className="size-4.5" />
              </span>
            </Link>
            <Link
              href="/studio/register"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border border-gray-900/10 bg-surface/80 px-7 text-base font-medium text-gray-800 backdrop-blur transition-colors hover:border-gray-300 sm:w-auto"
            >
              List your gym
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {assurances.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon className="size-4.5 text-emerald-600" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
