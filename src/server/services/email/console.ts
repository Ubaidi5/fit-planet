import "server-only";
import type { EmailProvider } from "./types";

/** Prints emails to the server log. Handy for magic links during development. */
export const consoleEmailProvider: EmailProvider = {
  name: "console",
  async send(message) {
    console.info(`\n[email] to: ${message.to}\n[email] subject: ${message.subject}\n${message.text}\n`);
  },
};
