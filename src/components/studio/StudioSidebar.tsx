"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  HiOutlineChartBar,
  HiOutlineOfficeBuilding,
  HiOutlineReceiptTax,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineSpeakerphone,
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineLightningBolt,
  HiOutlineChevronDoubleLeft,
  HiOutlineLightBulb,
} from "react-icons/hi";

interface ModuleLink {
  id: number;
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const modules: ModuleLink[] = [
  {
    id: 9,
    title: "Dashboard",
    href: "/studio/dashboard",
    icon: <HiOutlineChartBar className="h-5 w-5" />,
  },
  {
    id: 10,
    title: "Gym Profile",
    href: "/studio/profile",
    icon: <HiOutlineOfficeBuilding className="h-5 w-5" />,
  },
  {
    id: 11,
    title: "Pass & Pricing",
    href: "/studio/passes",
    icon: <HiOutlineReceiptTax className="h-5 w-5" />,
  },
  {
    id: 12,
    title: "Capacity",
    href: "/studio/capacity",
    icon: <HiOutlineUserGroup className="h-5 w-5" />,
    badge: "Live",
  },
  {
    id: 13,
    title: "Bookings",
    href: "/studio/bookings",
    icon: <HiOutlineCalendar className="h-5 w-5" />,
  },
  {
    id: 14,
    title: "Promotions",
    href: "/studio/promotions",
    icon: <HiOutlineSpeakerphone className="h-5 w-5" />,
  },
  {
    id: 15,
    title: "Reviews",
    href: "/studio/reviews",
    icon: <HiOutlineStar className="h-5 w-5" />,
  },
  {
    id: 16,
    title: "Financial",
    href: "/studio/financial",
    icon: <HiOutlineCurrencyDollar className="h-5 w-5" />,
  },
];

export function StudioSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
                <HiOutlineLightningBolt className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">
                  Fit Planet
                </span>
                <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                  Studio
                </span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <HiOutlineChevronDoubleLeft
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {/* Section Header */}
          {!isCollapsed && (
            <div className="mb-3 px-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Studio Modules
              </h3>
            </div>
          )}

          {/* Module Links */}
          {modules.map((module) => {
            const isActive = pathname === module.href;
            return (
              <Link
                key={module.id}
                href={module.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center",
                )}
                title={isCollapsed ? module.title : undefined}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-emerald-600" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                >
                  {module.icon}
                </div>

                {/* Title */}
                {!isCollapsed && (
                  <span className="flex-1 truncate">{module.title}</span>
                )}

                {/* Badge */}
                {!isCollapsed && module.badge && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {module.badge}
                  </span>
                )}

                {/* Module Number (Collapsed) */}
                {isCollapsed && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {module.id}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3">
          {!isCollapsed ? (
            <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <HiOutlineLightBulb className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Need Help?
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Check our guide
                  </p>
                  <button className="mt-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    View Tutorial →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
              title="Need Help?"
            >
              <HiOutlineLightBulb className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
