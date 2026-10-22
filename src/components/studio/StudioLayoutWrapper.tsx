"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiOutlineBars3, HiOutlineBell } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { StudioSidebar } from "./StudioSidebar";

const AUTH_PAGES = ["/studio/login", "/studio/register", "/studio/forgot-password"];

export function StudioLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (AUTH_PAGES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <StudioSidebar
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
            aria-label="Open navigation"
          >
            <HiOutlineBars3 className="size-5" />
          </button>
          <Logo href="/studio/dashboard" tag="Studio" />
          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-900/5"
            aria-label="Notifications"
          >
            <HiOutlineBell className="size-5" />
            <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-surface" />
          </button>
        </div>
      </header>

      <main
        className={cn(
          "transition-[padding] duration-500 ease-out-expo",
          isCollapsed ? "lg:ps-24" : "lg:ps-72",
        )}
      >
        {children}
      </main>
    </div>
  );
}
