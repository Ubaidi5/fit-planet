"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { HiArrowRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import { RegionSwitcher } from "@/components/i18n/RegionSwitcher";

const navLinks = [
  { href: "/gyms", label: "Find gyms" },
  { href: "/#orbit", label: "Explore" },
  { href: "/#passport", label: "Passport" },
  { href: "/#for-owners", label: "For gym owners" },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the sheet whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full ps-4 pe-2 transition-all duration-500 ease-out-expo sm:ps-5",
          scrolled || isMobileMenuOpen
            ? "border border-gray-900/[0.06] bg-surface/92 shadow-soft backdrop-blur-xl backdrop-saturate-150"
            : "border border-transparent",
        )}
      >
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "bg-gray-900/5 text-ink"
                    : "text-gray-600 hover:bg-gray-900/[0.04] hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1 lg:flex">
          <RegionSwitcher />
          <Link
            href="/studio/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-ink"
          >
            Studio login
          </Link>
          <Link
            href="/app/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-900/[0.04] hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="/app/register"
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink ps-5 pe-1.5 text-sm font-medium text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.12)] transition-colors hover:bg-gray-800"
          >
            Get started
            <span className="flex size-8 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 rtl:rotate-180">
              <HiArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-0.5 lg:hidden">
          <RegionSwitcher />
          <button
            type="button"
            className="relative inline-flex size-11 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-900/5 active:scale-95 lg:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute start-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out-expo",
                  isMobileMenuOpen && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 start-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out-expo",
                  isMobileMenuOpen && "bottom-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-3 top-[5.25rem] z-40 origin-top rounded-4xl border border-gray-900/[0.06] bg-surface p-3 shadow-lift transition-all duration-500 ease-out-expo sm:inset-x-4 lg:hidden",
          isMobileMenuOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-medium text-gray-800 transition-all duration-500 ease-out-expo hover:bg-gray-900/[0.04]",
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0",
              )}
              style={{
                transitionDelay: `${isMobileMenuOpen ? 60 + index * 40 : 0}ms`,
              }}
            >
              {link.label}
              <HiOutlineArrowUpRight className="size-4 text-gray-400 rtl:-scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-900/[0.06] pt-3">
          <Link
            href="/app/login"
            className="flex h-12 items-center justify-center rounded-full border border-gray-200 text-sm font-medium text-gray-800"
          >
            Log in
          </Link>
          <Link
            href="/app/register"
            className="flex h-12 items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
          >
            Get started
          </Link>
          <Link
            href="/studio/login"
            className="col-span-2 flex h-11 items-center justify-center text-sm font-medium text-gray-500"
          >
            Own a gym? Studio login
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          "fixed inset-0 -z-10 bg-canvas/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
    </header>
  );
};

export default Header;
