"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  HiOutlineSearch,
  HiOutlineLightningBolt,
  HiOutlineOfficeBuilding,
  HiOutlineInformationCircle,
  HiOutlineArrowCircleRight,
  HiOutlineLogin,
  HiOutlineChevronRight,
} from "react-icons/hi";

const navLinks = [
  {
    href: "/gyms",
    label: "Find Gyms",
    icon: <HiOutlineSearch className="h-4 w-4" />,
  },
  {
    href: "/#how-it-works",
    label: "How It Works",
    icon: <HiOutlineLightningBolt className="h-4 w-4" />,
  },
  {
    href: "/#for-owners",
    label: "For Gym Owners",
    icon: <HiOutlineOfficeBuilding className="h-4 w-4" />,
  },
  {
    href: "/about",
    label: "About",
    icon: <HiOutlineInformationCircle className="h-4 w-4" />,
  },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100"
          : "bg-white/80 backdrop-blur-md",
      )}
    >
      {/* Top Announcement Bar */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-9 items-center justify-center gap-2 text-xs font-medium">
            <HiOutlineArrowCircleRight className="h-3.5 w-3.5" />
            <span>Limited Time: First Month Free for New Gym Owners!</span>
            <Link
              href="/studio/register"
              className="underline underline-offset-2 hover:text-emerald-100"
            >
              Sign Up →
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Premium Design */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-600 opacity-20 blur-xl transition-all group-hover:opacity-30" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-xl shadow-emerald-500/30 transition-transform group-hover:scale-105">
                <HiOutlineLightningBolt className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Fit Planet
              </span>
              <span className="text-[10px] font-medium tracking-wide text-emerald-600">
                YOUR FITNESS HUB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Modern Design */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:text-gray-900 hover:bg-gray-50"
              >
                <span className="text-gray-400 transition-colors group-hover:text-emerald-600">
                  {link.icon}
                </span>
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Premium Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/app/register"
              className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
            >
              <HiOutlineLogin className="h-4 w-4 text-gray-500 transition-colors group-hover:text-emerald-600" />
              Log in
            </Link>

            <Link
              href="/app/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
            >
              <HiOutlineLightningBolt className="relative h-4 w-4" />
              <span className="relative">Get Started</span>
            </Link>
          </div>

          {/* Mobile Menu Button - Modern Design */}
          <button
            type="button"
            className="lg:hidden relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-300 active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "h-0.5 w-5 rounded-full bg-gray-700 transition-all duration-300",
                  isMobileMenuOpen && "rotate-45 translate-y-2",
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-5 rounded-full bg-gray-700 transition-all duration-300",
                  isMobileMenuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-5 rounded-full bg-gray-700 transition-all duration-300",
                  isMobileMenuOpen && "-rotate-45 -translate-y-2",
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu - Premium Design */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 ease-in-out",
            isMobileMenuOpen
              ? "max-h-150 opacity-100 pb-6"
              : "max-h-0 opacity-0",
          )}
        >
          <nav className="mt-4 space-y-2 rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50/50 p-3 shadow-xl backdrop-blur-xl">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:text-gray-900 hover:shadow-md"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                  {link.icon}
                </span>
                {link.label}
                <HiOutlineChevronRight className="ml-auto h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <HiOutlineLogin className="h-4 w-4" />
                Log in
              </Link>

              <Link
                href="/app/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:scale-105"
              >
                <HiOutlineLightningBolt className="h-4 w-4" />
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
