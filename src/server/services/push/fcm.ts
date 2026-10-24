import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { env } from "@/server/env";
import type { PushProvider } from "./types";

function serviceAccount() {
  const raw = env.push.serviceAccount;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  return JSON.parse(json) as { project_id: string; client_email: string; private_key: string };
}

function app(): App {
  const existing = getApps().find((a) => a.name === "fit-planet");
  if (existing) return existing;
  const account = serviceAccount();
  return initializeApp(
    {
      credential: cert({
        projectId: account.project_id,
        clientEmail: account.client_email,
        privateKey: account.private_key.replace(/\\n/g, "\n"),
      }),
    },
    "fit-planet",
  );
}

const INVALID = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument",
]);

export const fcmProvider: PushProvider = {
  name: "fcm",

  async send(tokens, message) {
    if (tokens.length === 0) return { invalidTokens: [], successCount: 0 };
    const link = message.link ? new URL(message.link, env.appUrl).toString() : env.appUrl;
    const response = await getMessaging(app()).sendEachForMulticast({
      tokens,
      // Data-only payload: the service worker builds the notification so the
      // click target and icon are consistent in every browser.
      data: { title: message.title, body: message.body, link, tag: message.tag ?? "", ...message.data },
      webpush: { headers: { Urgency: "high" }, fcmOptions: { link } },
    });
    const invalidTokens: string[] = [];
    response.responses.forEach((result, index) => {
      if (!result.success && result.error && INVALID.has(result.error.code)) invalidTokens.push(tokens[index]);
    });
    return { invalidTokens, successCount: response.successCount };
  },
};
