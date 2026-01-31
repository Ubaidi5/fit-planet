"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    href: "/gyms",
    label: "Find Gyms",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    href: "/#how-it-works",
    label: "How It Works",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    href: "/#for-owners",
    label: "For Gym Owners",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
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
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
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
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
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
              <svg
                className="h-4 w-4 text-gray-500 transition-colors group-hover:text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log in
            </Link>

            <Link
              href="/app/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
            >
              <svg
                className="relative h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
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
                <svg
                  className="ml-auto h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Log in
              </Link>

              <Link
                href="/app/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
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
