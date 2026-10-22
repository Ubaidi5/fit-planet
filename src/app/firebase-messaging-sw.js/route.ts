import { firebaseWebConfig } from "@/lib/firebase/config";

/**
 * The Firebase messaging service worker, generated so it can read the public
 * Firebase config from env instead of hardcoding it in /public.
 * It shows background notifications and focuses/opens the right page on tap.
 */
export function GET() {
  const config = firebaseWebConfig();
  const script = config
    ? `importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
firebase.initializeApp(${JSON.stringify(config)});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  self.registration.showNotification(data.title || "Fit Planet", {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    tag: data.tag || undefined,
    data: { link: data.link || "/" },
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(link);
          return client.focus();
        }
      }
      return clients.openWindow(link);
    })
  );
});`
    : `// Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables.`;
  return new Response(script, {
    headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache", "Service-Worker-Allowed": "/" },
  });
}
