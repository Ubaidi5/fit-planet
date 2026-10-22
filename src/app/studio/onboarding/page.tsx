import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { GymEditor } from "@/components/studio/GymEditor";
import { emptyGymValues } from "@/components/studio/gym-form-values";
import { getOwnerContext } from "@/server/session";

export const metadata: Metadata = { title: "Add your gym" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ another?: string }> }) {
  const { user, gyms } = await getOwnerContext();
  if (!user) redirect("/studio/login?next=/studio/onboarding");
  const { another } = await searchParams;
  if (gyms.length > 0 && !another) redirect("/studio/dashboard");

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-18 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" tag="Studio" />
        <span className="text-sm text-gray-500">About 5 minutes</span>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.16em] text-emerald-700 uppercase">List your gym · Free</p>
        <h1 className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          Let&apos;s put {user.name ? `${user.name.split(" ")[0]}'s gym` : "your gym"} on the map
        </h1>
        <p className="mt-2 mb-8 text-[15px] text-gray-600">You can change everything later. Nothing goes live until you publish.</p>
        <GymEditor mode="onboarding" initial={emptyGymValues()} />
      </main>
    </div>
  );
}
