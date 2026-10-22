import {
  HiCheck,
  HiMapPin,
  HiOutlineCalendarDays,
  HiOutlineClipboardDocumentList,
  HiOutlineQrCode,
  HiOutlineUserGroup,
  HiOutlineSignal,
  HiStar,
} from "react-icons/hi2";
import { FauxQR } from "@/components/brand/FauxQR";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import { mockGyms } from "@/lib/data/mock-gyms";
import { Accent, SectionHeading } from "./SectionHeading";

const featured = mockGyms[0];

// Pin positions on the illustrative map, as percentages
const mapPins = [
  { top: "22%", left: "18%" },
  { top: "58%", left: "30%" },
  { top: "34%", left: "52%", active: true },
  { top: "70%", left: "66%" },
  { top: "28%", left: "80%" },
  { top: "52%", left: "88%" },
];

const hourlyCrowd = [18, 32, 64, 48, 30, 26, 38, 72, 88, 60, 34];

const passes = [
  { label: "Day pass", price: featured.pricing.dayPass },
  { label: "Week pass", price: featured.pricing.weekPass, popular: true },
  { label: "Month pass", price: featured.pricing.monthPass },
];

const routine = [
  { name: "Bench press", sets: "4 × 8", done: true },
  { name: "Incline dumbbell", sets: "3 × 10", done: true },
  { name: "Cable fly", sets: "3 × 12", done: false },
];

const buddies = ["AK", "SM", "UR", "HS", "ZB"];

function BentoCard({
  className,
  icon,
  title,
  description,
  children,
  delay = 0,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface p-6 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-8",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-canvas text-emerald-700 ring-1 ring-gray-900/[0.06] transition-colors duration-500 group-hover:bg-volt group-hover:text-ink">
          {icon}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      </div>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-600">
        {description}
      </p>
      {children && <div className="mt-8 flex-1">{children}</div>}
    </Reveal>
  );
}

const Features: React.FC = () => {
  return (
    <section id="members" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="For members"
          title={
            <>
              Everything between you and a <Accent>great workout</Accent>
            </>
          }
          description="From finding the right gym to logging your last set, Fit Planet keeps the whole journey in one calm, fast app."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {/* Discover */}
          <BentoCard
            className="md:col-span-2 lg:col-span-4"
            icon={<HiMapPin className="size-5" />}
            title="Discover gyms near you"
            description="Filter by distance, price, amenities and equipment. Every listing shows real photos, hours and reviews."
          >
            <div className="relative h-56 overflow-hidden rounded-3xl bg-canvas bg-line-grid ring-1 ring-gray-900/[0.05] sm:h-64">
              {/* Roads */}
              <svg aria-hidden="true" className="absolute inset-0 size-full text-gray-900/[0.07]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 62 C 25 55, 40 75, 100 48" stroke="currentColor" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M38 0 C 42 30, 30 60, 44 100" stroke="currentColor" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M72 0 C 70 40, 84 70, 78 100" stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
              </svg>

              {mapPins.map((pin, index) => (
                <span
                  key={index}
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{ top: pin.top, left: pin.left }}
                >
                  {pin.active && (
                    <span className="absolute bottom-0 left-1/2 size-6 -translate-x-1/2 translate-y-1/2 animate-pulse-ring rounded-full bg-emerald-500/40" />
                  )}
                  <span
                    className={cn(
                      "relative flex items-center justify-center rounded-full rounded-bl-none shadow-soft ring-2 ring-white transition-transform duration-500 group-hover:-translate-y-1",
                      pin.active ? "size-9 -rotate-45 bg-ink" : "size-6 -rotate-45 bg-emerald-600",
                    )}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <span className={cn("rotate-45 rounded-full bg-white", pin.active ? "size-2.5" : "size-1.5")} />
                  </span>
                </span>
              ))}

              {/* Result chip */}
              <div className="absolute right-3 bottom-3 left-3 flex items-center gap-3 rounded-2xl bg-surface/95 p-3 shadow-lift backdrop-blur sm:right-auto sm:left-[46%] sm:w-72">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-bold text-volt">
                  FZ
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{featured.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <HiStar className="size-3.5 text-amber-400" />
                    {featured.rating} · {featured.distance} km · Rs. {featured.pricing.dayPass}/day
                  </p>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Capacity */}
          <BentoCard
            className="lg:col-span-2"
            icon={<HiOutlineSignal className="size-5" />}
            title="Real-time capacity"
            description="See how busy a gym is before you leave home."
            delay={80}
          >
            <div className="flex h-40 items-end gap-1.5">
              {hourlyCrowd.map((value, index) => {
                const isNow = index === 4;
                return (
                  <div key={index} className="flex h-full flex-1 flex-col justify-end">
                    <div
                      className={cn(
                        "w-full origin-bottom rounded-md transition-all duration-700 ease-out-expo group-hover:scale-y-105",
                        isNow ? "bg-ink" : value > 60 ? "bg-emerald-300" : "bg-emerald-100",
                      )}
                      style={{ height: `${value}%`, transitionDelay: `${index * 30}ms` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>6am</span>
              <span className="rounded-full bg-ink px-2 py-0.5 font-medium text-white">Now · quiet</span>
              <span>11pm</span>
            </div>
          </BentoCard>

          {/* Booking */}
          <BentoCard
            className="lg:col-span-2"
            icon={<HiOutlineCalendarDays className="size-5" />}
            title="Instant booking"
            description="Day, week or monthly passes with clear prices. Confirmed on the spot."
          >
            <div className="space-y-2">
              {passes.map((pass) => (
                <div
                  key={pass.label}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm ring-1 transition-colors",
                    pass.popular
                      ? "bg-ink text-white ring-ink"
                      : "bg-canvas text-gray-700 ring-gray-900/[0.05]",
                  )}
                >
                  <span className="flex items-center gap-2 font-medium">
                    {pass.label}
                    {pass.popular && (
                      <span className="rounded-full bg-volt px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                        Popular
                      </span>
                    )}
                  </span>
                  <span className="font-semibold tabular-nums">Rs. {pass.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* QR */}
          <BentoCard
            className="lg:col-span-2"
            icon={<HiOutlineQrCode className="size-5" />}
            title="Your phone is the pass"
            description="Scan at the door. No cards, no registers, no waiting."
            delay={80}
          >
            <div className="flex items-center justify-center rounded-3xl bg-canvas py-6 ring-1 ring-gray-900/[0.05]">
              <div className="relative rounded-2xl bg-white p-3 shadow-soft transition-transform duration-700 ease-out-expo group-hover:scale-105">
                <FauxQR seed="bento-pass" size={112} />
                <span className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full bg-volt text-ink shadow-soft">
                  <HiCheck className="size-4" strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Routines */}
          <BentoCard
            className="lg:col-span-2"
            icon={<HiOutlineClipboardDocumentList className="size-5" />}
            title="Routines that stick"
            description="Build workouts, follow them set by set and track personal records."
            delay={160}
          >
            <div className="rounded-3xl bg-canvas p-4 ring-1 ring-gray-900/[0.05]">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Push day</span>
                <span className="text-gray-500">2 of 3 done</span>
              </div>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-2/3 rounded-full bg-emerald-500" />
              </div>
              <ul className="space-y-2">
                {routine.map((item) => (
                  <li key={item.name} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full",
                        item.done ? "bg-emerald-600 text-white" : "ring-1 ring-gray-300",
                      )}
                    >
                      {item.done && <HiCheck className="size-3" strokeWidth={1.5} />}
                    </span>
                    <span className={cn("flex-1", item.done ? "text-gray-400 line-through" : "text-gray-800")}>
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500 tabular-nums">{item.sets}</span>
                  </li>
                ))}
              </ul>
            </div>
          </BentoCard>

          {/* Social */}
          <Reveal
            as="article"
            className="relative overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-volt-soft/70 p-6 shadow-soft md:col-span-2 lg:col-span-6 sm:p-8"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-surface text-emerald-700 ring-1 ring-gray-900/[0.06]">
                    <HiOutlineUserGroup className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">Train together</h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
                  Find gym buddies, share routines, join monthly challenges and see
                  when friends are heading to the gym. Accountability, built in.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2.5">
                  {buddies.map((initials, index) => (
                    <span
                      key={initials}
                      className="flex size-11 items-center justify-center rounded-full bg-surface text-xs font-semibold text-gray-700 ring-3 ring-volt-soft"
                      style={{ zIndex: buddies.length - index }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div className="rounded-2xl bg-surface px-4 py-3 shadow-soft">
                  <p className="text-sm font-semibold text-ink">October step-up challenge</p>
                  <p className="mt-0.5 text-xs text-gray-500">20 sessions · 5 friends joined</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Features;
