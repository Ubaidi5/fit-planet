import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { requireUser } from "@/server/session";
import { ensureHandle, searchPeople, suggestedPeople } from "@/server/modules/social";
import { PersonRow } from "@/components/social/PersonRow";
import { SocialTabs } from "@/components/social/SocialTabs";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("social.people"))("meta") };
}

export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const user = await requireUser("/app/social/people");
  const t = await getTranslations("social");
  await ensureHandle(user);
  const query = q.trim().slice(0, 40);
  const [results, suggestions] = await Promise.all([query ? searchPeople(user._id, query) : Promise.resolve([]), suggestedPeople(user._id, 12)]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-gray-400 uppercase">{t("eyebrow")}</p>
        <h1 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">{t("tabs.people")}</h1>
      </div>
      <SocialTabs active="people" />
      <form action="/app/social/people" className="flex h-12 items-center gap-2 rounded-full bg-surface px-4 shadow-soft ring-1 ring-gray-900/[0.05] focus-within:ring-ink/20">
        <HiOutlineMagnifyingGlass className="size-5 text-gray-400" />
        <input
          name="q"
          defaultValue={query}
          placeholder={t("people.search")}
          aria-label={t("people.searchAria")}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-gray-400"
          autoCapitalize="none"
        />
      </form>

      {query && (
        <section className="rounded-3xl bg-surface px-5 py-2 shadow-soft ring-1 ring-gray-900/[0.05]">
          {results.length ? (
            <ul className="divide-y divide-gray-900/[0.06]">
              {results.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-gray-500">{t("people.noMatch", { query })}</p>
          )}
        </section>
      )}

      <section className="rounded-3xl bg-surface px-5 pt-4 pb-2 shadow-soft ring-1 ring-gray-900/[0.05]">
        <h2 className="text-base font-semibold text-ink">{t("people.suggested")}</h2>
        <p className="text-sm text-gray-500">{t("people.suggestedHint")}</p>
        {suggestions.length ? (
          <ul className="mt-1 divide-y divide-gray-900/[0.06]">
            {suggestions.map((p) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-gray-500">
            {t.rich("people.none", { link: (c) => <Link href="/app/social?tab=discover" className="font-semibold text-ink underline">{c}</Link> })}
          </p>
        )}
      </section>
    </div>
  );
}
