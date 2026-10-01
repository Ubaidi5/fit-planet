import { HiOutlineGift, HiOutlineGlobeAlt, HiOutlineTrophy } from "react-icons/hi2";
import { Reveal } from "@/components/motion/Reveal";
import { MrzLine } from "@/components/passport/MrzLine";
import { Stamp } from "@/components/passport/Stamp";
import { Accent, SectionHeading } from "./SectionHeading";

const stamps = [
  { code: "KHI", label: "Karachi", date: "02 AUG", tone: "teal", shape: "circle", rotate: -10 },
  { code: "DXB", label: "Dubai", date: "19 AUG", tone: "ochre", shape: "rect", rotate: 6 },
  { code: "BER", label: "Berlin", date: "03 SEP", tone: "magenta", shape: "dashed", rotate: -4 },
  { code: "LIS", label: "Lisbon", date: "07 SEP", tone: "violet", shape: "circle", rotate: 12 },
  { code: "LON", label: "London", date: "15 SEP", tone: "teal", shape: "rect", rotate: -7 },
  { code: "TYO", label: "Tokyo", date: "28 SEP", tone: "magenta", shape: "circle", rotate: 8 },
] as const;

const perks = [
  { icon: HiOutlineGlobeAlt, title: "A stamp per city", text: "Check in once and the city lands in your passport for good." },
  { icon: HiOutlineTrophy, title: "Streaks that travel", text: "Your weekly streak keeps counting in any city, on any pass." },
  { icon: HiOutlineGift, title: "Perks for regulars", text: "Partner gyms reward full passports with free sessions and gear." },
];

const holderStats = [
  { label: "Cities", value: "06" },
  { label: "Visits", value: "41" },
  { label: "Streak", value: "9 wk" },
];

export default function PassportSection() {
  return (
    <section id="passport" className="scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Your passport"
          title={
            <>
              Every workout leaves <Accent>a stamp</Accent>
            </>
          }
          description="Your history goes everywhere with you. One profile, one streak and one QR for every partner gym on the planet."
        />

        <Reveal className="mx-auto mt-14 max-w-5xl">
          <div className="grid overflow-hidden rounded-[2rem] bg-surface shadow-pass ring-1 ring-gray-900/[0.06] md:grid-cols-2">
            {/* Stamps page */}
            <div className="relative bg-[linear-gradient(var(--color-volt-soft),var(--color-surface))] p-6 sm:p-10">
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
                <span>Visas · Entries</span>
                <span>04</span>
              </div>
              <div className="mt-6 grid grid-cols-3 place-items-center gap-y-6">
                {stamps.map((stamp, index) => (
                  <Reveal key={stamp.code} delay={200 + index * 90}>
                    <Stamp {...stamp} size="sm" className="sm:scale-125" />
                  </Reveal>
                ))}
              </div>
              {/* Spine shadow */}
              <span aria-hidden="true" className="absolute inset-y-0 end-0 hidden w-10 bg-linear-to-l from-gray-900/[0.06] to-transparent md:block rtl:bg-linear-to-r" />
            </div>

            {/* Holder page */}
            <div className="relative flex flex-col p-6 sm:p-10">
              <span aria-hidden="true" className="absolute inset-y-0 start-0 hidden w-10 bg-linear-to-r from-gray-900/[0.05] to-transparent md:block rtl:bg-linear-to-l" />
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">
                <span>Fit Planet · Passport</span>
                <span>FP-0042</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink text-2xl font-semibold text-volt">
                  HS
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-holo" />
                </span>
                <div className="min-w-0 font-mono text-[11px] tracking-[0.1em] text-gray-400 uppercase">
                  <p>Holder</p>
                  <p className="mt-0.5 truncate font-sans text-xl font-semibold tracking-[-0.02em] text-ink normal-case">Hira Siddiqui</p>
                  <p className="mt-2">Member since</p>
                  <p className="mt-0.5 text-ink">MAR 2026</p>
                </div>
              </div>
              <dl className="mt-8 grid grid-cols-3 divide-x divide-dashed divide-gray-900/15 rounded-2xl border border-dashed border-gray-900/15 rtl:divide-x-reverse">
                {holderStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center py-4">
                    <dt className="order-2 font-mono text-[10px] tracking-[0.12em] text-gray-400 uppercase">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-ink tabular-nums">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto space-y-1 overflow-hidden pt-8" dir="ltr">
                <MrzLine text="Siddiqui Hira FP0042 PK" className="text-[11px] text-gray-500 sm:text-[12px]" />
                <MrzLine text="Stamps KHI DXB BER LIS LON TYO" className="text-[11px] text-gray-500 sm:text-[12px]" />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 90} className="rounded-3xl border border-gray-900/[0.06] bg-surface/70 p-6">
              <Icon className="size-6 text-emerald-700" />
              <p className="mt-4 font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
