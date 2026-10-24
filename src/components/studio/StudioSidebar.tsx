"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { StudioGymSummary, StudioUser } from "./StudioLayoutWrapper";
import { Logo, LogoMark } from "@/components/brand/Logo";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineChevronDoubleLeft,
  HiOutlineCurrencyDollar,
  HiOutlineReceiptPercent,
  HiOutlineStar,
  HiXMark,
  HiOutlineQrCode,
  HiOutlineBell,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { signOutAction } from "@/actions/auth";

type IconType = React.ComponentType<{ className?: string }>;

interface ModuleLink {
  key: string;
  href: string;
  icon: IconType;
  badge?: string;
  /** Front-desk staff see this too */
  staff?: boolean;
}

const moduleGroups: { label: string; items: ModuleLink[] }[] = [
  {
    label: "overview",
    items: [
      { key: "dashboard", href: "/studio/dashboard", icon: HiOutlineChartBarSquare },
      { key: "checkin", href: "/studio/checkin", icon: HiOutlineQrCode, badge: "scan", staff: true },
      { key: "bookings", href: "/studio/bookings", icon: HiOutlineCalendarDays, staff: true },
      { key: "notifications", href: "/studio/notifications", icon: HiOutlineBell, staff: true },
    ],
  },
  {
    label: "grow",
    items: [
      { key: "passes", href: "/studio/passes", icon: HiOutlineReceiptPercent },
      { key: "reviews", href: "/studio/reviews", icon: HiOutlineStar },
    ],
  },
  {
    label: "business",
    items: [
      { key: "financial", href: "/studio/financial", icon: HiOutlineCurrencyDollar },
      { key: "profile", href: "/studio/profile", icon: HiOutlineBuildingOffice2 },
      { key: "team", href: "/studio/team", icon: HiOutlineUserGroup },
    ],
  },
];

interface StudioSidebarProps {
  gym: StudioGymSummary;
  role: "owner" | "staff";
  user: StudioUser;
  gymCount: number;
  unread: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function StudioSidebar({
  gym,
  role,
  user,
  unread,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: StudioSidebarProps) {
  const t = useTranslations("studio.nav");
  const pathname = usePathname();
  // The mobile drawer always shows the full sidebar
  const collapsed = isCollapsed && !mobileOpen;

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm transition-opacity duration-500 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed top-3 bottom-3 start-3 z-50 flex flex-col rounded-4xl border border-gray-900/[0.06] bg-surface shadow-soft transition-all duration-500 ease-out-expo",
          "w-[17rem] lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-lift" : "-translate-x-[calc(100%_+_1rem)] max-lg:rtl:translate-x-[calc(100%_+_1rem)]",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-[16.5rem]",
        )}
        aria-label={t("aria")}
      >
        {/* Header */}
        <div className={cn("flex h-18 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
          {collapsed ? (
            <Link href={role === "owner" ? "/studio/dashboard" : "/studio/checkin"} aria-label={t("dashboard")}>
              <LogoMark />
            </Link>
          ) : (
            <Logo href={role === "owner" ? "/studio/dashboard" : "/studio/checkin"} tag="Studio" />
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-900/5 lg:hidden"
            aria-label={t("close")}
          >
            <HiXMark className="size-5" />
          </button>
        </div>

        {/* Gym switcher */}
        {!collapsed && (
          <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl bg-canvas p-2.5 ring-1 ring-gray-900/[0.04]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ink text-xs font-bold text-volt">
              {gym.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{gym.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={cn("size-1.5 rounded-full", gym.status === "published" ? "bg-emerald-500" : "bg-stamp-ochre")} />
                <span className="truncate">
                  {gym.status === "published" ? t("live") : t("draft")} · {gym.area}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3 no-scrollbar">
          {moduleGroups
            .map((group) => ({ ...group, items: group.items.filter((item) => role === "owner" || item.staff) }))
            .filter((group) => group.items.length > 0)
            .map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  {t(`groups.${group.label}`)}
                </p>
              ) : (
                <div className="mx-auto mb-2 h-px w-6 bg-gray-900/[0.08]" />
              )}
              <div className="space-y-0.5">
                {group.items.map((module) => {
                  const isActive = pathname === module.href;
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.href}
                      href={module.href}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? t(module.key) : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out-expo",
                        isActive
                          ? "bg-ink text-white shadow-soft"
                          : "text-gray-600 hover:bg-gray-900/[0.04] hover:text-ink",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 shrink-0 transition-colors",
                          isActive ? "text-volt" : "text-gray-400 group-hover:text-gray-700",
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{t(module.key)}</span>}
                      {!collapsed && module.badge && (
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            isActive ? "bg-white/10 text-volt" : "bg-emerald-50 text-emerald-700",
                          )}
                        >
                          <span className="size-1.5 animate-pulse rounded-full bg-current" />
                          {t(module.badge)}
                        </span>
                      )}
                      {!collapsed && module.href === "/studio/notifications" && unread > 0 && (
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums", isActive ? "bg-white/15 text-white" : "bg-red-50 text-red-600")}>
                          {unread}
                        </span>
                      )}
                      {collapsed && module.badge && (
                        <span className="absolute top-2 right-3 size-1.5 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-2 p-3">
          {!collapsed && (
            <Link
              href={`/gyms/${gym.slug}`}
              className="group flex items-center justify-between rounded-2xl bg-volt-soft/80 px-3.5 py-3 text-sm transition-colors hover:bg-volt-soft"
            >
              <span>
                <span className="block font-semibold text-ink">{t("viewListing")}</span>
                <span className="text-xs text-gray-600">{t("viewListingHint")}</span>
              </span>
              <HiOutlineArrowTopRightOnSquare className="size-4 text-gray-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>
          )}
          {!collapsed && (
            <div className="flex items-center gap-2.5 rounded-2xl px-2 py-1.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-volt text-xs font-semibold text-ink">{user.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <Link href="/app/dashboard" className="text-xs text-gray-500 hover:text-ink">
                  {t("memberApp")}
                </Link>
              </div>
              <form action={signOutAction}>
                <input type="hidden" name="next" value="/studio/login" />
                <button type="submit" aria-label={t("signOut")} title={t("signOut")} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-900/5 hover:text-ink">
                  <HiOutlineArrowRightOnRectangle className="size-4.5" />
                </button>
              </form>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "hidden w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-900/[0.04] hover:text-ink lg:flex",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? t("expand") : t("collapse")}
          >
            <HiOutlineChevronDoubleLeft
              className={cn("size-5 transition-transform duration-500", collapsed && "rotate-180")}
            />
            {!collapsed && t("collapseShort")}
          </button>
        </div>
      </aside>
    </>
  );
}
