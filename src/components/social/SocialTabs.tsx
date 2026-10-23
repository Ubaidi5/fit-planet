import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "following", href: "/app/social" },
  { key: "discover", href: "/app/social?tab=discover" },
  { key: "people", href: "/app/social/people" },
] as const;

export async function SocialTabs({ active }: { active: (typeof tabs)[number]["key"] | null }) {
  const tt = await getTranslations("social.tabs");
  return (
    <nav aria-label={tt("aria")} className="flex gap-1 rounded-full bg-gray-900/[0.05] p-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={cn(
            "flex h-9 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors sm:flex-none",
            active === t.key ? "bg-surface text-ink shadow-soft" : "text-gray-500 hover:text-ink",
          )}
        >
          {tt(t.key)}
        </Link>
      ))}
    </nav>
  );
}
