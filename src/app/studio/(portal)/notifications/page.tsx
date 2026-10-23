import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { requireOwner } from "@/server/session";
import { listNotifications } from "@/server/modules/notifications";
import { PageHeader } from "@/components/studio/PageHeader";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { PushPrompt } from "@/components/notifications/PushManager";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getTranslations("studio.nav"))("notifications") };
}

export default async function StudioNotificationsPage() {
  const { user } = await requireOwner("/studio/notifications");
  const items = await listNotifications(user._id, 100);
  const t = await getTranslations("studio.pages");
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={t("inbox")} title={t("notifications")} />
      <PushPrompt className="mb-6" title={t("pushTitle")} body={t("pushBody")} />
      <NotificationFeed initial={items} />
    </div>
  );
}
