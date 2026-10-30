/**
 * Why an admin suspended an account or a studio. The key is stored and goes in
 * the email (translated under "email.reasons"); the label is for the admin console.
 */
export const suspensionReasons = [
  { key: "spam", label: "Spam or fake activity", for: ["user"] },
  { key: "fakeAccount", label: "Fake or impersonating account", for: ["user"] },
  { key: "harassment", label: "Harassing or abusive behaviour", for: ["user"] },
  { key: "fakeListing", label: "Fake or unverifiable listing", for: ["gym"] },
  { key: "misleading", label: "Misleading photos, prices or details", for: ["gym"] },
  { key: "safety", label: "Safety or hygiene complaints", for: ["gym"] },
  { key: "complaints", label: "Repeated member complaints", for: ["gym"] },
  { key: "fraud", label: "Payment fraud or chargebacks", for: ["user", "gym"] },
  { key: "terms", label: "Breaking our terms of service", for: ["user", "gym"] },
  { key: "other", label: "Other (write the reason)", for: ["user", "gym"] },
] as const;

export type SuspensionReason = (typeof suspensionReasons)[number]["key"];
export type SuspensionTarget = "user" | "gym";

export const reasonKeys = suspensionReasons.map((r) => r.key) as [SuspensionReason, ...SuspensionReason[]];

export const reasonsFor = (target: SuspensionTarget) => suspensionReasons.filter((r) => (r.for as readonly string[]).includes(target));

export const reasonLabel = (key: string) => suspensionReasons.find((r) => r.key === key)?.label ?? key;
