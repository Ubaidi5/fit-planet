"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/gyms", label: "Gyms" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav({ openReports }: { openReports: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      {tabs.map((tab) => {
        const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
              active ? "bg-ink text-white" : "text-gray-600 hover:bg-surface hover:text-ink",
            )}
          >
            {tab.label}
            {tab.href === "/admin/reports" && openReports > 0 && (
              <span className={cn("rounded-full px-1.5 text-[11px] leading-5 tabular-nums", active ? "bg-white/20" : "bg-red-100 text-red-700")}>{openReports}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
