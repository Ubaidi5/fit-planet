/** Email delivery contract. SMTP covers SES, Resend, Postmark, Gmail and most others. */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}
