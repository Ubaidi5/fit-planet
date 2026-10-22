import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { listNotifications } from "@/server/modules/notifications";
import { PageHeader } from "@/components/studio/PageHeader";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { PushPrompt } from "@/components/notifications/PushManager";

export const metadata: Metadata = { title: "Notifications" };

export default async function StudioNotificationsPage() {
  const { user } = await requireOwner("/studio/notifications");
  const items = await listNotifications(user._id, 100);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow="Inbox" title="Notifications" />
      <PushPrompt className="mb-6" title="Never miss a booking" body="Turn on push and this device alerts you the moment a member books a pass." />
      <NotificationFeed initial={items} />
    </div>
  );
}
