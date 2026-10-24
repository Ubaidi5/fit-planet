import "server-only";
import type { PushProvider } from "./types";

/** Logs pushes instead of sending them. Used when Firebase isn't configured. */
export const consolePushProvider: PushProvider = {
  name: "console",
  async send(tokens, message) {
    console.info(`[push] to ${tokens.length} device(s): ${message.title} - ${message.body}`);
    return { invalidTokens: [], successCount: tokens.length };
  },
};
