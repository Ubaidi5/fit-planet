import { getTranslations } from "next-intl/server";
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

const panelPoints: Record<Variant, { icon: React.ComponentType<{ className?: string }>; key: string }[]> = {
  member: [
    { icon: HiOutlineDevicePhoneMobile, key: "phone" },
    { icon: HiOutlineShieldCheck, key: "signIn" },
    { icon: HiOutlineUserGroup, key: "friends" },
  ],
  studio: [
    { icon: HiOutlineQrCode, key: "checkins" },
    { icon: HiOutlineChartBar, key: "capacity" },
    { icon: HiOutlineCurrencyDollar, key: "alerts" },
  ],
};

async function MemberVisual() {
  const t = await getTranslations("auth.shell.visual");
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{t("dayPass")}</p>
            <p className="text-lg font-semibold tracking-tight text-ink">Urban Iron Berlin</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
            {t("active")}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-3xl bg-canvas p-4">
          <div className="rounded-2xl bg-white p-2 shadow-soft">
            <FauxQR seed="auth-member" size={96} />
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-500">{t("validToday")}</p>
            <p className="font-semibold text-ink">{t("hoursSample")}</p>
            <p className="text-gray-500">Mitte · {t("distanceSample")}</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-6 flex animate-float items-center gap-2.5 rounded-2xl border border-gray-900/[0.06] bg-surface py-2.5 pe-4 ps-2.5 shadow-lift">
        <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
          <HiCheck className="size-4" />
        </span>
        <span className="text-sm font-semibold text-ink">{t("checkedIn")}</span>
      </div>
    </div>
  );
}

async function StudioVisual() {
  const t = await getTranslations("auth.shell.visual");
  const bars = [40, 62, 48, 74, 66, 88, 100];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-4xl border border-gray-900/[0.06] bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">{t("weekly")}</p>
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
            <p className="text-xs text-gray-500">{t("checkinsToday")}</p>
          </div>
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-xl font-semibold text-ink tabular-nums">64%</p>
            <p className="text-xs text-gray-500">{t("capacityNow")}</p>
          </div>
        </div>
      </div>
      <div className="absolute -top-5 -left-5 flex animate-float items-center gap-2.5 rounded-2xl border border-gray-900/[0.06] bg-surface py-2.5 pe-4 ps-2.5 shadow-lift">
        <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink">
          <HiOutlineCurrencyDollar className="size-4" />
        </span>
        <span className="text-sm font-semibold text-ink">{t("booked")}</span>
      </div>
    </div>
  );
}

export async function AuthShell({ variant, children, aside, width = "sm" }: AuthShellProps) {
  const t = await getTranslations(`auth.shell.${variant}`);
  const tc = await getTranslations("auth.shell");

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
            {tc("back")}
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
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 max-w-md text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-ink xl:text-[2.75rem]">
            {t.rich("title", { accent: (c) => <Accent>{c}</Accent> })}
          </h2>
        </div>

        <div className="relative py-12">
          {variant === "member" ? <MemberVisual /> : <StudioVisual />}
        </div>

        <ul className="relative grid gap-5 xl:grid-cols-3">
          {panelPoints[variant].map(({ icon: Icon, key }) => (
            <li key={key}>
              <span className="flex size-9 items-center justify-center rounded-xl bg-surface text-emerald-700 shadow-soft">
                <Icon className="size-4.5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{t(`points.${key}.title`)}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{t(`points.${key}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
