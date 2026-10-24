import "server-only";
import { env } from "@/server/env";
import type { EmailProvider } from "./types";
import { smtpProvider } from "./smtp";
import { consoleEmailProvider } from "./console";

export * from "./types";

const providers: Record<string, EmailProvider> = {
  smtp: smtpProvider,
  console: consoleEmailProvider,
};

/** The active email provider, chosen by EMAIL_PROVIDER */
export function email(): EmailProvider {
  return providers[env.email.provider] ?? consoleEmailProvider;
}
