import { AppShell } from "@/components/app/AppShell";
import { requireUser, initials } from "@/server/session";
import { unreadCount } from "@/server/modules/notifications";
import { collections } from "@/server/db/collections";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/app/dashboard");
  const [unread, ownsGym] = await Promise.all([
    unreadCount(user._id),
    (await collections.gyms()).countDocuments({ ownerId: user._id }, { limit: 1 }),
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
