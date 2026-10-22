"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import {
  HiOutlineBell,
  HiOutlineBookmark,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineQueueList,
  HiOutlineShieldCheck,
  HiOutlineSquares2X2,
  HiOutlineTicket,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiXMark,
} from "react-icons/hi2";

type IconType = React.ComponentType<{ className?: string }>;

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
}

const primaryNav: NavItem[] = [
  { href: "/app/dashboard", label: "Home", icon: HiOutlineHome },
  { href: "/app/passes", label: "Passes", icon: HiOutlineTicket },
  { href: "/app/routines", label: "Routines", icon: HiOutlineClipboardDocumentList },
  { href: "/app/social", label: "Social", icon: HiOutlineUserGroup },
  { href: "/app/checkins", label: "Check-ins", icon: HiOutlineClipboardDocumentCheck },
];

const secondaryNav: NavItem[] = [
  { href: "/app/exercises", label: "Exercise library", icon: HiOutlineQueueList },
  { href: "/app/saved-gyms", label: "Saved gyms", icon: HiOutlineBookmark },
  { href: "/app/notifications", label: "Notifications", icon: HiOutlineBell },
  { href: "/app/profile", label: "Profile", icon: HiOutlineUser },
  { href: "/app/security", label: "Security", icon: HiOutlineShieldCheck },
];

// Items shown in the mobile tab bar
const tabNav: NavItem[] = [
  primaryNav[0],
  primaryNav[1],
  primaryNav[2],
  primaryNav[3],
  { href: "/app/profile", label: "Profile", icon: HiOutlineUser },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Auth pages render full-bleed without the app chrome
  if (pathname === "/app/login" || pathname === "/app/register") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
        <div className="glass mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-full border border-gray-900/[0.06] pe-2 ps-4 shadow-soft sm:ps-5">
          <Logo href="/app/dashboard" />

          <nav
            aria-label="App"
            className="hidden items-center gap-0.5 rounded-full bg-gray-900/[0.04] p-1 lg:flex"
          >
            {primaryNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300 ease-out-expo",
                    active
                      ? "bg-surface text-ink shadow-soft"
                      : "text-gray-600 hover:text-ink",
                  )}
                >
                  <Icon className={cn("size-4.5", active && "text-emerald-600")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/gyms"
              className="hidden h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-900/5 hover:text-ink sm:flex"
            >
              <HiOutlineMagnifyingGlass className="size-4.5" />
              <span className="hidden md:inline">Find gyms</span>
            </Link>
            <Link
              href="/app/notifications"
              aria-label="Notifications, 2 unread"
              className="relative flex size-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-900/5 hover:text-ink"
            >
              <HiOutlineBell className="size-5" />
              <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-surface" />
            </Link>
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-label="Open account menu"
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-900/5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-volt text-sm font-semibold text-ink">
                MA
              </span>
            </button>
          </div>
        </div>

        {/* Account / more menu */}
        <div
          className={cn(
            "absolute right-3 top-[5.25rem] w-[min(20rem,calc(100vw_-_1.5rem))] origin-top-right rounded-3xl border border-gray-900/[0.06] bg-surface p-2 shadow-lift transition-all duration-300 ease-out-expo sm:right-4 lg:right-[max(1rem,calc((100vw_-_80rem)/2_+_1rem))]",
            moreOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
          )}
        >
          <div className="flex items-center justify-between px-3 pt-2 pb-3">
            <div>
              <p className="text-sm font-semibold text-ink">Muhammad Ali</p>
              <p className="text-xs text-gray-500">Member since March 2024</p>
            </div>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-900/5 hover:text-gray-700"
              aria-label="Close menu"
            >
              <HiXMark className="size-4" />
            </button>
          </div>
          <div className="border-t border-gray-900/[0.06] pt-1.5">
            {[primaryNav[4], ...secondaryNav].map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-canvas text-ink" : "text-gray-700 hover:bg-canvas",
                  )}
                >
                  <Icon className="size-4.5 text-gray-400" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/gyms"
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <HiOutlineSquares2X2 className="size-4.5" />
              Browse all gyms
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-28 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile tab bar */}
      <nav
        aria-label="App tabs"
        className="glass fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full border border-gray-900/[0.06] p-1.5 shadow-lift pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        {tabNav.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-all duration-300 ease-out-expo",
                active ? "bg-ink text-white" : "text-gray-500",
              )}
            >
              <Icon className={cn("size-5", active && "text-volt")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {moreOpen && (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setMoreOpen(false)}
        />
      )}
    </div>
  );
}
