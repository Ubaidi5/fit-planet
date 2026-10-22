import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Logo } from "@/components/brand/Logo";

const footerLinks = [
  {
    title: "Members",
    links: [
      { href: "/gyms", label: "Find gyms" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/app/register", label: "Create account" },
      { href: "/app/login", label: "Member login" },
    ],
  },
  {
    title: "Gym owners",
    links: [
      { href: "/#for-owners", label: "Why Fit Planet" },
      { href: "/studio/register", label: "List your gym" },
      { href: "/studio/login", label: "Studio login" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/#members", label: "Routines & social" },
      { href: "/#stories", label: "Pilot stories" },
      { href: "/gyms?q=Clifton", label: "Gyms in Clifton" },
      { href: "/gyms?q=DHA", label: "Gyms in DHA" },
    ],
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "X", href: "https://x.com", icon: FaXTwitter },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

const Footer: React.FC = () => {
  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface">
        <div className="grid gap-12 px-6 pt-12 pb-10 sm:px-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-14 lg:pt-16">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-gray-500">
              The gym network for your city. Members find and book any gym in
              seconds. Owners fill capacity without building their own tech.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:text-ink"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-gray-600 transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none px-4 text-center font-serif text-[21vw] leading-[0.8] tracking-tight text-gray-900/[0.05] italic lg:text-[15.5rem]"
        >
          Fit Planet
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-900/[0.06] px-6 py-6 text-sm text-gray-500 sm:flex-row sm:px-10 lg:px-14">
          <p>&copy; {new Date().getFullYear()} Fit Planet. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500" />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            Now live in Karachi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
