import { getLocale, getTranslations } from "next-intl/server";
import type { LegalSection } from "@/lib/legal/content";

/** Shared frame for the privacy policy, terms and imprint */
export async function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro?: string; sections: LegalSection[] }) {
  const [t, locale] = await Promise.all([getTranslations("legal"), getLocale()]);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${updated}T00:00:00Z`));

  return (
    <main className="px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-gray-400 uppercase">{t("updated", { date })}</p>
        <h1 className="mt-3 text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-5xl">{title}</h1>
        {!locale.startsWith("en") && (
          <p className="mt-5 rounded-2xl bg-canvas px-4 py-3 text-sm text-gray-600 ring-1 ring-gray-900/[0.06]">{t("englishOnly")}</p>
        )}
        {intro && <p className="mt-6 text-[17px] leading-relaxed text-pretty text-gray-600">{intro}</p>}

        {sections.length > 2 && (
          <nav aria-label={t("contents")} className="mt-10 rounded-[1.75rem] bg-surface p-5 shadow-soft ring-1 ring-gray-900/[0.05] sm:p-7">
            <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] text-gray-400 uppercase">{t("contents")}</h2>
            <ol className="mt-4 grid gap-x-8 gap-y-2.5 text-[15px] sm:grid-cols-2">
              {sections.map((section, i) => (
                <li key={section.id} className="flex gap-3">
                  <span className="w-5 shrink-0 font-mono text-xs leading-6 text-gray-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#${section.id}`} className="text-gray-600 transition-colors hover:text-ink">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-12 space-y-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
                {sections.length > 2 && <span className="font-mono text-sm font-medium text-gray-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>}
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                {section.body.map((block, j) =>
                  typeof block === "string" ? (
                    <p key={j} className="text-pretty">
                      {block}
                    </p>
                  ) : (
                    <ul key={j} className="space-y-2.5">
                      {block.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span className="text-pretty">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
