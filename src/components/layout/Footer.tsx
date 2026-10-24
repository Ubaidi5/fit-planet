import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Logo } from "@/components/brand/Logo";
import { platformSnapshot } from "@/server/modules/platform";

type FooterGroup = { title: string; links: { href: string; label: string; city?: string }[] };

const footerLinks: FooterGroup[] = [
  {
    title: "members",
    links: [
      { href: "/gyms", label: "findGyms" },
      { href: "/#how-it-works", label: "howItWorks" },
      { href: "/app/register", label: "createAccount" },
      { href: "/app/login", label: "memberLogin" },
    ],
  },
  {
    title: "owners",
    links: [
      { href: "/#for-owners", label: "whyUs" },
      { href: "/studio/register", label: "listGym" },
      { href: "/studio/login", label: "studioLogin" },
    ],
  },
];

const legalLinks = [
  { href: "/privacy", label: "privacy" },
  { href: "/terms", label: "terms" },
  { href: "/imprint", label: "imprint" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "X", href: "https://x.com", icon: FaXTwitter },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

const Footer = async () => {
  const [t, { stats }] = await Promise.all([getTranslations("footer"), platformSnapshot()]);
  const explore: FooterGroup = {
    title: "explore",
    links: [
      ...(stats.gyms > 0 ? [{ href: "/#orbit", label: "exploreNearby" }] : []),
      ...stats.cities.slice(0, 3).map((city) => ({ href: `/gyms?city=${encodeURIComponent(city)}`, label: "gymsIn", city })),
    ],
  };
  const groups = explore.links.length > 0 ? [...footerLinks, explore] : footerLinks;
  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-gray-900/[0.06] bg-surface">
        <div className="grid gap-12 px-6 pt-12 pb-10 sm:px-10 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-14 lg:pt-16">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-gray-500">
              {t("tagline")}
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
            {groups.map((group) => (
              <div key={t(group.title)}>
                <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-400">
                  {t(group.title)}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-gray-600 transition-colors hover:text-ink"
                      >
                        {link.city ? t(link.label, { city: link.city }) : t(link.label)}
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
          className="pointer-events-none select-none overflow-hidden px-4 text-center text-[19vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-gray-900/[0.05] lg:text-[14rem]"
        >
          fit planet
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-900/[0.06] px-6 py-6 text-sm text-gray-500 sm:flex-row sm:px-10 lg:px-14">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <p>{t("copyright", { year: new Date().getFullYear() })}</p>
            <nav aria-label={t("legal")} className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
                  {t(link.label)}
                </Link>
              ))}
            </nav>
          </div>
          {stats.cities.length > 0 && (
            <p className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-500" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              {t("liveIn", { count: stats.cities.length })}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
