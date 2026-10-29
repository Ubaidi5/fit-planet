import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";
import { env } from "@/server/env";
import { jsonLd } from "@/lib/seo";

export interface Crumb {
  label: string;
  href: string;
}

/** schema.org BreadcrumbList for a trail of crumbs, the last one being the current page */
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${env.appUrl}${item.href}`,
    })),
  };
}

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd(items)) }} />
      <nav aria-label={label}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[11px] tracking-[0.12em] text-gray-400 uppercase">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-gray-600">{item.label}</span>
                ) : (
                  <>
                    <Link href={item.href} className="transition-colors hover:text-ink">
                      {item.label}
                    </Link>
                    <HiChevronRight aria-hidden="true" className="size-3 rtl:rotate-180" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
