import "server-only";
import type { EmailMessage } from "./types";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Simple, client-safe branded layout: paper canvas, navy ink, mint button */
function layout({ preheader, heading, body, cta }: { preheader: string; heading: string; body: string; cta?: { label: string; url: string } }) {
  const button = cta
    ? `<tr><td style="padding:8px 0 28px"><a href="${escape(cta.url)}" style="display:inline-block;background:#9fe3d6;color:#1c2550;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px">${escape(cta.label)}</a></td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#eef0ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c2550">
<span style="display:none;max-height:0;overflow:hidden">${escape(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fdfdfc;border-radius:24px;padding:32px">
<tr><td style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.14em;color:#8a90a6;text-transform:uppercase;padding-bottom:20px">Fit Planet · Passport</td></tr>
<tr><td style="font-size:24px;font-weight:700;letter-spacing:-.02em;padding-bottom:12px">${escape(heading)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#4a5170;padding-bottom:20px">${body}</td></tr>
${button}
<tr><td style="font-size:12px;color:#8a90a6;border-top:1px solid #e6e8e3;padding-top:16px">You are receiving this because you have a Fit Planet account.</td></tr>
</table></td></tr></table></body></html>`;
}

export function magicLinkEmail(to: string, url: string): EmailMessage {
  return {
    to,
    subject: "Your Fit Planet sign-in link",
    text: `Sign in to Fit Planet:\n${url}\n\nThe link expires in 24 hours. If you didn't ask for it, ignore this email.`,
    html: layout({
      preheader: "Tap to sign in. The link expires in 24 hours.",
      heading: "Sign in to Fit Planet",
      body: "Tap the button below to sign in. The link expires in 24 hours and can be used once. If you didn't ask for it, you can ignore this email.",
      cta: { label: "Sign in", url },
    }),
  };
}

export function passwordResetEmail(to: string, url: string): EmailMessage {
  return {
    to,
    subject: "Reset your Fit Planet password",
    text: `Reset your password:\n${url}\n\nThe link expires in 1 hour.`,
    html: layout({
      preheader: "Choose a new password. The link expires in 1 hour.",
      heading: "Reset your password",
      body: "Someone asked to reset the password for this account. If it was you, choose a new one below. The link expires in 1 hour.",
      cta: { label: "Choose a new password", url },
    }),
  };
}

export function bookingConfirmedEmail(
  to: string,
  data: { name: string; gymName: string; passLabel: string; dates: string; code: string; amount: string; url: string },
): EmailMessage {
  return {
    to,
    subject: `Your ${data.passLabel} at ${data.gymName}`,
    text: `Hi ${data.name}, your ${data.passLabel} at ${data.gymName} is confirmed.\nValid: ${data.dates}\nPass code: ${data.code}\nPaid: ${data.amount}\n\nShow the QR code at the desk: ${data.url}`,
    html: layout({
      preheader: `Valid ${data.dates}. Show the QR code at the desk.`,
      heading: "You're booked in",
      body: `Hi ${escape(data.name)}, your <strong>${escape(data.passLabel)}</strong> at <strong>${escape(data.gymName)}</strong> is confirmed.<br/><br/>
Valid: ${escape(data.dates)}<br/>Pass code: <span style="font-family:ui-monospace,Menlo,monospace;letter-spacing:.08em">${escape(data.code)}</span><br/>Total: ${escape(data.amount)}`,
      cta: { label: "Open my pass", url: data.url },
    }),
  };
}
