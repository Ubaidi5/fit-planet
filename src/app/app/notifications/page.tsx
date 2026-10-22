import type { Metadata } from "next";
import { requireUser } from "@/server/session";
import { listNotifications } from "@/server/modules/notifications";
import { defaultNotificationPrefs } from "@/server/modules/users";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { NotificationSettings } from "@/components/member/NotificationSettings";
import { PushPrompt } from "@/components/notifications/PushManager";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await requireUser("/app/notifications");
  const items = await listNotifications(user._id, 100);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div>
        <h1 className="mb-5 text-[1.75rem] font-semibold tracking-[-0.035em] text-ink sm:text-4xl">Notifications</h1>
        <NotificationFeed initial={items} />
      </div>
      <aside className="space-y-4 lg:sticky lg:top-28">
        <PushPrompt title="Get alerts on this device" body="Booking confirmations and pass reminders, even when Fit Planet is closed." />
        <h2 className="text-sm font-semibold text-ink">Settings</h2>
        <NotificationSettings initial={user.notificationPrefs ?? defaultNotificationPrefs} />
      </aside>
    </div>
  );
}
