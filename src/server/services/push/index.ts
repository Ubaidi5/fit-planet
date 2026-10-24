import "server-only";
import { env } from "@/server/env";
import type { PushProvider } from "./types";
import { fcmProvider } from "./fcm";
import { consolePushProvider } from "./console";

export * from "./types";

const providers: Record<string, PushProvider> = {
  fcm: fcmProvider,
  console: consolePushProvider,
};

/** The active push provider, chosen by PUSH_PROVIDER */
export function push(): PushProvider {
  return providers[env.push.provider] ?? consolePushProvider;
}
