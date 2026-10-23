const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });
const dateFmt = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });

/** "now", "5 min. ago", "3 hr. ago", then a plain date after a week */
export function timeAgo(iso: string, now = Date.now()) {
  const sec = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(sec);
  if (abs < 45) return "now";
  if (abs < 3600) return rtf.format(Math.round(sec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), "hour");
  if (abs < 7 * 86400) return rtf.format(Math.round(sec / 86400), "day");
  return dateFmt.format(new Date(iso));
}
