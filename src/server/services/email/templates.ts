import "server-only";
import type { PassType } from "@/lib/passes";
import type { Translate } from "@/server/i18n";
import type { EmailMessage } from "./types";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** Simple, client-safe branded layout: paper canvas, navy ink, mint button */
function layout(t: Translate, { preheader, heading, body, cta }: { preheader: string; heading: string; body: string; cta?: { label: string; url: string } }) {
  const button = cta
    ? `<tr><td style="padding:8px 0 28px"><a href="${escape(cta.url)}" style="display:inline-block;background:#9fe3d6;color:#1c2550;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px">${escape(cta.label)}</a></td></tr>`
    : "";
  return `<!doctype html><html dir="${t("dir")}"><body style="margin:0;background:#eef0ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c2550">
<span style="display:none;max-height:0;overflow:hidden">${escape(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fdfdfc;border-radius:24px;padding:32px">
<tr><td style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.14em;color:#8a90a6;text-transform:uppercase;padding-bottom:20px">Fit Planet · Passport</td></tr>
<tr><td style="font-size:24px;font-weight:700;letter-spacing:-.02em;padding-bottom:12px">${escape(heading)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#4a5170;padding-bottom:20px">${body}</td></tr>
${button}
<tr><td style="font-size:12px;color:#8a90a6;border-top:1px solid #e6e8e3;padding-top:16px">${escape(t("footer"))}</td></tr>
</table></td></tr></table></body></html>`;
}

export function magicLinkEmail(to: string, url: string, t: Translate): EmailMessage {
  return {
    to,
    subject: t("magic.subject"),
    text: `${t("magic.heading")}:\n${url}\n\n${t("magic.body")}`,
    html: layout(t, {
      preheader: t("magic.preheader"),
      heading: t("magic.heading"),
      body: escape(t("magic.body")),
      cta: { label: t("magic.cta"), url },
    }),
  };
}

export function passwordResetEmail(to: string, url: string, t: Translate): EmailMessage {
  return {
    to,
    subject: t("reset.subject"),
    text: `${t("reset.heading")}:\n${url}\n\n${t("reset.preheader")}`,
    html: layout(t, {
      preheader: t("reset.preheader"),
      heading: t("reset.heading"),
      body: escape(t("reset.body")),
      cta: { label: t("reset.cta"), url },
    }),
  };
}

export function bookingConfirmedEmail(
  to: string,
  data: { name: string; gymName: string; pass: PassType; dates: string; code: string; amount: string; url: string },
  t: Translate,
): EmailMessage {
  const values = { name: data.name, gym: data.gymName, pass: data.pass };
  const details = [
    `${t("booking.valid")}: ${data.dates}`,
    `${t("booking.code")}: ${data.code}`,
    `${t("booking.total")}: ${data.amount}`,
  ];
  return {
    to,
    subject: t("booking.subject", values),
    text: `${t("booking.intro", values)}\n${details.join("\n")}\n\n${t("booking.showQr")} ${data.url}`,
    html: layout(t, {
      preheader: t("booking.preheader", { dates: data.dates }),
      heading: t("booking.heading"),
      body: `${escape(t("booking.intro", values))}<br/><br/>
${escape(t("booking.valid"))}: ${escape(data.dates)}<br/>${escape(t("booking.code"))}: <span style="font-family:ui-monospace,Menlo,monospace;letter-spacing:.08em">${escape(data.code)}</span><br/>${escape(t("booking.total"))}: ${escape(data.amount)}`,
      cta: { label: t("booking.cta"), url: data.url },
    }),
  };
}

export function staffInviteEmail(to: string, data: { gym: string; inviter: string; url: string }, t: Translate): EmailMessage {
  const values = { gym: data.gym, name: data.inviter };
  return {
    to,
    subject: t("staffInvite.subject", values),
    text: `${t("staffInvite.heading", values)}\n\n${t("staffInvite.body", values)}\n\n${data.url}`,
    html: layout(t, {
      preheader: t("staffInvite.preheader", values),
      heading: t("staffInvite.heading", values),
      body: escape(t("staffInvite.body", values)),
      cta: { label: t("staffInvite.cta"), url: data.url },
    }),
  };
}
