"use client";

import { firebaseVapidKey, firebaseWebConfig } from "./config";

// Browser side of web push: asks permission, registers the Firebase service
// worker and returns an FCM token for this device. Loaded lazily so the
// Firebase SDK never ships on pages that don't use it.

export type PushSupport = "unsupported" | "unconfigured" | "denied" | "default" | "granted";

export function pushSupport(): PushSupport {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) return "unsupported";
  if (!firebaseWebConfig() || !firebaseVapidKey) return "unconfigured";
  return Notification.permission as PushSupport;
}

async function messaging() {
  const config = firebaseWebConfig();
  if (!config) throw new Error("Firebase is not configured");
  const [{ initializeApp, getApps }, { getMessaging, isSupported }] = await Promise.all([import("firebase/app"), import("firebase/messaging")]);
  if (!(await isSupported())) throw new Error("This browser doesn't support web push");
  const app = getApps()[0] ?? initializeApp(config);
  return getMessaging(app);
}

/** Requests permission (if needed) and returns this device's push token */
export async function getPushToken(): Promise<string | null> {
  if (pushSupport() === "unsupported" || pushSupport() === "unconfigured") return null;
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return null;
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
  const { getToken } = await import("firebase/messaging");
  return getToken(await messaging(), { vapidKey: firebaseVapidKey, serviceWorkerRegistration: registration });
}

/** Subscribes to pushes that arrive while the app is open in the foreground */
export async function onForegroundPush(handler: (data: Record<string, string>) => void) {
  const { onMessage } = await import("firebase/messaging");
  return onMessage(await messaging(), (payload) => handler((payload.data ?? {}) as Record<string, string>));
}
