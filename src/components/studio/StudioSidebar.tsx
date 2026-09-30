"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/brand/Logo";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineChevronDoubleLeft,
  HiOutlineCurrencyDollar,
  HiOutlineMegaphone,
  HiOutlineReceiptPercent,
  HiOutlineStar,
  HiOutlineUserGroup,
  HiXMark,
} from "react-icons/hi2";

type IconType = React.ComponentType<{ className?: string }>;

interface ModuleLink {
  title: string;
  href: string;
  icon: IconType;
  badge?: string;
}

const moduleGroups: { label: string; items: ModuleLink[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/studio/dashboard", icon: HiOutlineChartBarSquare },
      { title: "Capacity", href: "/studio/capacity", icon: HiOutlineUserGroup, badge: "Live" },
      { title: "Bookings", href: "/studio/bookings", icon: HiOutlineCalendarDays },
    ],
  },
  {
    label: "Grow",
    items: [
      { title: "Passes & pricing", href: "/studio/passes", icon: HiOutlineReceiptPercent },
      { title: "Promotions", href: "/studio/promotions", icon: HiOutlineMegaphone },
      { title: "Reviews", href: "/studio/reviews", icon: HiOutlineStar },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Financial", href: "/studio/financial", icon: HiOutlineCurrencyDollar },
      { title: "Gym profile", href: "/studio/profile", icon: HiOutlineBuildingOffice2 },
    ],
  },
];

interface StudioSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function StudioSidebar({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: StudioSidebarProps) {
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
          "fixed top-3 bottom-3 left-3 z-50 flex flex-col rounded-4xl border border-gray-900/[0.06] bg-surface shadow-soft transition-all duration-500 ease-out-expo",
          "w-[17rem] lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-lift" : "-translate-x-[calc(100%_+_1rem)]",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-[16.5rem]",
        )}
        aria-label="Studio navigation"
      >
        {/* Header */}
        <div className={cn("flex h-18 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
          {collapsed ? (
            <Link href="/studio/dashboard" aria-label="Studio dashboard">
              <LogoMark />
            </Link>
          ) : (
            <Logo href="/studio/dashboard" tag="Studio" />
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-900/5 lg:hidden"
            aria-label="Close navigation"
          >
            <HiXMark className="size-5" />
          </button>
        </div>

        {/* Gym switcher */}
        {!collapsed && (
          <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl bg-canvas p-2.5 ring-1 ring-gray-900/[0.04]">
            <span className="flex size-9 items-center justify-center rounded-xl bg-ink text-xs font-bold text-volt">
              FZ
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">FitZone Karachi</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Open · Clifton
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3 no-scrollbar">
          {moduleGroups.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  {group.label}
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
                      title={collapsed ? module.title : undefined}
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
                      {!collapsed && <span className="flex-1 truncate">{module.title}</span>}
                      {!collapsed && module.badge && (
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            isActive ? "bg-white/10 text-volt" : "bg-emerald-50 text-emerald-700",
                          )}
                        >
                          <span className="size-1.5 animate-pulse rounded-full bg-current" />
                          {module.badge}
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
              href="/gyms/fitzone-karachi"
              className="group flex items-center justify-between rounded-2xl bg-volt-soft/80 px-3.5 py-3 text-sm transition-colors hover:bg-volt-soft"
            >
              <span>
                <span className="block font-semibold text-ink">View public listing</span>
                <span className="text-xs text-gray-600">See what members see</span>
              </span>
              <HiOutlineArrowTopRightOnSquare className="size-4 text-gray-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "hidden w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-900/[0.04] hover:text-ink lg:flex",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <HiOutlineChevronDoubleLeft
              className={cn("size-5 transition-transform duration-500", collapsed && "rotate-180")}
            />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}
