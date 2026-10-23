"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineQrCode,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { PushListener } from "@/components/notifications/PushManager";
import { StudioSidebar } from "./StudioSidebar";

export interface StudioGymSummary {
  id: string;
  name: string;
  slug: string;
  area: string;
  city: string;
  status: "draft" | "published" | "suspended";
  initials: string;
}

export interface StudioUser {
  name: string;
  email: string | null;
  initials: string;
}

const ownerTabs = [
  { href: "/studio/dashboard", label: "today", icon: HiOutlineChartBarSquare },
  { href: "/studio/bookings", label: "bookings", icon: HiOutlineCalendarDays },
  { href: "/studio/checkin", label: "scan", icon: HiOutlineQrCode, primary: true },
  { href: "/studio/notifications", label: "alerts", icon: HiOutlineBell },
] as const;

// Front-desk staff: the desk tools only, no revenue
const staffTabs = [
  { href: "/studio/bookings", label: "bookings", icon: HiOutlineCalendarDays },
  { href: "/studio/checkin", label: "scan", icon: HiOutlineQrCode, primary: true },
  { href: "/studio/notifications", label: "alerts", icon: HiOutlineBell },
] as const;

export function StudioLayoutWrapper({
  children,
  gym,
  role,
  user,
  unread,
  gymCount,
}: {
  children: React.ReactNode;
  gym: StudioGymSummary;
  role: "owner" | "staff";
  user: StudioUser;
  unread: number;
  gymCount: number;
}) {
  const t = useTranslations("studio.nav");
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <PushListener />
      <StudioSidebar
        gym={gym}
        role={role}
        user={user}
        gymCount={gymCount}
        unread={unread}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 px-3 pt-3 lg:hidden">
        <div className="glass flex h-14 items-center justify-between rounded-full border border-gray-900/[0.06] pe-1.5 ps-2 shadow-soft">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-900/5"
            aria-label={t("open")}
          >
            <HiOutlineBars3 className="size-5" />
          </button>
          <Logo href={role === "owner" ? "/studio/dashboard" : "/studio/checkin"} tag="Studio" />
          <Link
            href="/studio/notifications"
            className="relative flex size-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-900/5"
            aria-label={unread > 0 ? t("notificationsUnread", { count: unread }) : t("notifications")}
          >
            <HiOutlineBell className="size-5" />
            {unread > 0 && <span className="absolute top-2 end-2.5 size-2 rounded-full bg-red-500 ring-2 ring-surface" />}
          </Link>
        </div>
      </header>

      <main className={cn("pb-28 transition-[padding] duration-500 ease-out-expo lg:pb-0", isCollapsed ? "lg:ps-24" : "lg:ps-72")}>
        {role === "owner" && gym.status === "draft" && pathname !== "/studio/profile" && (
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <Link
              href="/studio/profile"
              className="flex items-center justify-between gap-3 rounded-3xl bg-stamp-ochre/10 px-4 py-3 text-sm text-stamp-ochre ring-1 ring-stamp-ochre/20 sm:px-5"
            >
              <span>
                {t.rich("draftBanner", { name: gym.name, b: (chunks) => <span className="font-semibold">{chunks}</span> })}
              </span>
              <span className="shrink-0 font-semibold underline underline-offset-4">{t("publish")}</span>
            </Link>
          </div>
        )}
        {children}
      </main>

      {/* Mobile tab bar: the four things owners do on their phone */}
      <nav
        aria-label={t("tabsAria")}
        className="glass fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-full border border-gray-900/[0.06] p-1.5 shadow-lift pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {(role === "owner" ? ownerTabs : staffTabs).map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          if ("primary" in tab) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-0.5 py-0.5"
              >
                <span className={cn("flex size-11 items-center justify-center rounded-full shadow-soft", active ? "bg-volt text-ink" : "bg-ink text-volt")}>
                  <Icon className="size-5.5" />
                </span>
                <span className="sr-only">{t(`tabs.${tab.label}`)}</span>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-all duration-300 ease-out-expo",
                active ? "bg-ink text-white" : "text-gray-500",
              )}
            >
              <Icon className={cn("size-5", active && "text-volt")} />
              {t(`tabs.${tab.label}`)}
              {tab.href === "/studio/notifications" && unread > 0 && (
                <span className="absolute top-1.5 start-[calc(50%_+_4px)] flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
