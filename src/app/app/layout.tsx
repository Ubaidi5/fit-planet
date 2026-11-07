import { AppShell } from "@/components/app/AppShell";
import { requireUser, initials } from "@/server/session";
import { unreadCount } from "@/server/modules/notifications";
import { collections } from "@/server/db/collections";
import { orFallback } from "@/server/degrade";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/app/dashboard");
  // Badge and menu extras: if they fail, the app still opens without them
  const [unread, ownsGym] = await Promise.all([
    orFallback("[app] unread count failed", unreadCount(user._id), 0),
    orFallback("[app] owner check failed", async () => (await collections.gyms()).countDocuments({ ownerId: user._id }, { limit: 1 }), 0),
  ]);
  return (
    <AppShell
      unread={unread}
      user={{
        name: user.name ?? "Member",
        email: user.email ?? null,
        image: user.image ?? null,
        initials: initials(user.name),
        memberSince: user.createdAt ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(user.createdAt) : null,
        isOwner: ownsGym > 0,
      }}
    >
      {children}
    </AppShell>
  );
}
