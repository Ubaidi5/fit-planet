import { StudioLayoutWrapper } from "@/components/studio/StudioLayoutWrapper";
import { requireOwner, initials } from "@/server/session";
import { unreadCount } from "@/server/modules/notifications";

export const dynamic = "force-dynamic";

export default async function StudioPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, gym, gyms, role } = await requireOwner();
  const unread = await unreadCount(user._id);
  return (
    <StudioLayoutWrapper
      role={role}
      unread={unread}
      user={{ name: user.name ?? "Owner", email: user.email ?? null, initials: initials(user.name) }}
      gym={{
        id: gym._id.toHexString(),
        name: gym.name,
        slug: gym.slug,
        area: gym.address.area,
        city: gym.address.city,
        status: gym.status,
        initials: initials(gym.name),
      }}
      gymCount={gyms.length}
    >
      {children}
    </StudioLayoutWrapper>
  );
}
