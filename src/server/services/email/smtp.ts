import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/server/env";
import type { EmailProvider } from "./types";

let transport: Transporter | null = null;

function transporter() {
  const { host, port, user, password } = env.email.smtp;
  if (!host) throw new Error("SMTP_HOST is not set");
  transport ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user ? { user, pass: password } : undefined,
  });
  return transport;
}

export const smtpProvider: EmailProvider = {
  name: "smtp",
  async send(message) {
    await transporter().sendMail({ from: env.email.from, ...message });
  },
};
