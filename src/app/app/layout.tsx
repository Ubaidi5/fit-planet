"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineTicket,
  HiOutlineClipboardList,
  HiOutlineViewList,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineUser,
  HiOutlineLightningBolt,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: <HiOutlineHome className="w-5 h-5" />,
  },
  {
    href: "/app/passes",
    label: "My Passes",
    icon: <HiOutlineTicket className="w-5 h-5" />,
  },
  {
    href: "/app/routines",
    label: "Routines",
    icon: <HiOutlineClipboardList className="w-5 h-5" />,
  },
  {
    href: "/app/exercises",
    label: "Exercises",
    icon: <HiOutlineViewList className="w-5 h-5" />,
  },
  {
    href: "/app/social",
    label: "Social",
    icon: <HiOutlineUserGroup className="w-5 h-5" />,
  },
  {
    href: "/app/checkins",
    label: "Check-ins",
    icon: <HiOutlineClipboardCheck className="w-5 h-5" />,
  },
  {
    href: "/app/profile",
    label: "Profile",
    icon: <HiOutlineUser className="w-5 h-5" />,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show sidebar on login/register pages
  if (pathname === "/app/login" || pathname === "/app/register") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600">
                <HiOutlineLightningBolt className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Fit Planet
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  {item.icon}
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Find Gyms Button */}
              <Link href="/gyms" className="hidden sm:block">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                  <HiOutlineSearch className="w-5 h-5" />
                  <span className="hidden md:inline">Find Gyms</span>
                </button>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <Link
                href="/app/profile"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium text-sm">
                  M
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <Link
                href="/gyms"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50"
              >
                <HiOutlineSearch className="w-5 h-5" />
                Find Gyms
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content (with top padding for fixed nav) */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
