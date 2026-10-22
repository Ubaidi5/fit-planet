import Link from "next/link";
import {
  HiArrowTrendingUp,
  HiCheck,
  HiOutlineDevicePhoneMobile,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineQrCode,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";
import { Logo } from "@/components/brand/Logo";
import { FauxQR } from "@/components/brand/FauxQR";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/sections/SectionHeading";

type Variant = "member" | "studio";

interface AuthShellProps {
  variant: Variant;
  children: React.ReactNode;
  /** Small link shown top-right of the form column */
  aside?: { text: string; href: string; label: string };
  /** Width of the form column content */
  width?: "sm" | "md" | "lg";
}

const panelCopy: Record<
  Variant,
  {
    eyebrow: string;
    title: React.ReactNode;
    points: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }[];
  }
> = {
  member: {
    eyebrow: "Fit Planet for members",
    title: (
      <>
        One account. <Accent>Every gym</Accent> in the city.
      </>
    ),
    points: [
      {
        icon: HiOutlineDevicePhoneMobile,
        title: "Your phone is your pass",
        text: "Show a QR code at any partner gym and walk in.",
      },
      {
        icon: HiOutlineShieldCheck,
        title: "Secure by default",
        text: "One-time codes, no passwords to remember.",
      },
      {
        icon: HiOutlineUserGroup,
        title: "Train with friends",
        text: "Share routines and plan sessions together.",
      },
    ],
  },
  studio: {
    eyebrow: "Fit Planet Studio",
    title: (
      <>
        Run your gym like a <Accent>modern business</Accent>.
      </>
    ),
    points: [
      {
        icon: HiOutlineQrCode,
        title: "QR check-ins",
        text: "Verify members at the door in a second.",
      },
      {
        icon: HiOutlineChartBar,
        title: "Live capacity and analytics",
        text: "Know your peak hours and plan staff around them.",
      },
      {
        icon: HiOutlineCurrencyDollar,
        title: "Weekly payouts",
        text: "Bookings settle straight to your bank account.",
      },
    ],
  },
};

function MemberVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Day pass</p>
            <p className="text-lg font-semibold tracking-tight text-ink">FitZone Karachi</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
            Active
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-3xl bg-canvas p-4">
          <div className="rounded-2xl bg-white p-2 shadow-soft">
            <FauxQR seed="auth-member" size={96} />
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-500">Valid today</p>
            <p className="font-semibold text-ink">06:00 to 23:00</p>
            <p className="text-gray-500">Clifton · 1.2 km</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-6 flex animate-float items-center gap-2.5 rounded-2xl border border-gray-900/[0.06] bg-surface py-2.5 pe-4 ps-2.5 shadow-lift">
        <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
          <HiCheck className="size-4" />
        </span>
        <span className="text-sm font-semibold text-ink">Checked in</span>
      </div>
    </div>
  );
}

function StudioVisual() {
  const bars = [40, 62, 48, 74, 66, 88, 100];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Weekly bookings</p>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <HiArrowTrendingUp className="size-3.5" />
            +12%
          </span>
        </div>
        <div className="mt-5 flex h-32 items-end gap-2">
          {bars.map((height, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-lg",
                index === bars.length - 1 ? "bg-emerald-600" : "bg-emerald-200/70",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-xl font-semibold text-ink tabular-nums">42</p>
            <p className="text-xs text-gray-500">Check-ins today</p>
          </div>
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-xl font-semibold text-ink tabular-nums">64%</p>
            <p className="text-xs text-gray-500">Capacity now</p>
          </div>
        </div>
      </div>
      <div className="absolute -top-5 -left-5 flex animate-float items-center gap-2.5 rounded-2xl border border-gray-900/[0.06] bg-surface py-2.5 pe-4 ps-2.5 shadow-lift">
        <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
          <HiOutlineCurrencyDollar className="size-4" />
        </span>
        <span className="text-sm font-semibold text-ink">Payout sent</span>
      </div>
    </div>
  );
}

export function AuthShell({ variant, children, aside, width = "sm" }: AuthShellProps) {
  const copy = panelCopy[variant];

  return (
    <div className="min-h-screen p-3 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-3">
      {/* Form column */}
      <div className="flex min-h-[calc(100vh_-_1.5rem)] flex-col px-2 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <Logo tag={variant === "studio" ? "Studio" : undefined} />
          {aside && (
            <p className="text-sm text-gray-500">
              <span className="hidden sm:inline">{aside.text} </span>
              <Link href={aside.href} className="font-semibold text-ink underline-offset-4 hover:underline">
                {aside.label}
              </Link>
            </p>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div
            className={cn(
              "w-full animate-fade-up",
              width === "sm" && "max-w-sm",
              width === "md" && "max-w-md",
              width === "lg" && "max-w-xl",
            )}
          >
            {children}
          </div>
        </div>

        <p className="pb-3 text-center text-xs text-gray-400 lg:text-start">
          &copy; {new Date().getFullYear()} Fit Planet ·{" "}
          <Link href="/" className="hover:text-gray-600">
            Back to website
          </Link>
        </p>
      </div>

      {/* Visual column */}
      <div className="relative hidden overflow-hidden rounded-[2.5rem] border border-gray-900/[0.06] bg-canvas-deep lg:sticky lg:top-3 lg:flex lg:h-[calc(100vh_-_1.5rem)] lg:flex-col lg:justify-between lg:p-12 xl:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-dot-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="absolute -top-24 -right-24 size-96 animate-blob rounded-full bg-volt/35 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 size-96 animate-blob rounded-full bg-emerald-300/30 blur-3xl [animation-delay:-7s]" />
        </div>

        <div className="relative">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 max-w-md text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-ink xl:text-[2.75rem]">
            {copy.title}
          </h2>
        </div>

        <div className="relative py-12">
          {variant === "member" ? <MemberVisual /> : <StudioVisual />}
        </div>

        <ul className="relative grid gap-5 xl:grid-cols-3">
          {copy.points.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="flex size-9 items-center justify-center rounded-xl bg-surface text-emerald-700 shadow-soft">
                <Icon className="size-4.5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
