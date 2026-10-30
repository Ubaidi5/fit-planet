/** How each audit log action reads after the admin's name */
export const actionLabels: Record<string, string> = {
  "gym.verify": "verified a gym",
  "gym.unverify": "removed a gym's verification",
  "gym.feature": "featured a gym",
  "gym.unfeature": "unfeatured a gym",
  "gym.suspend": "suspended a gym",
  "gym.restore": "restored a gym",
  "gym.edit": "edited a gym's details",
  "gym.hide": "hid a gym from the site",
  "gym.publish": "put a gym live",
  "gym.delete": "deleted a gym",
  "gym.deleteDemo": "removed the sample studios",
  "gym.transfer": "moved a gym to a new owner",
  "report.remove": "removed a reported post",
  "report.dismiss": "dismissed a report",
  "user.suspend": "suspended an account",
  "user.restore": "restored an account",
  "user.grantAdmin": "gave an account admin access",
  "user.revokeAdmin": "removed an account's admin access",
  "booking.refund": "refunded a pass",
  "booking.cancel": "cancelled a pass",
};

export const bookingStatusTone = {
  confirmed: "green",
  pending: "gray",
  expired: "gray",
  cancelled: "red",
  refunded: "amber",
} as const;

export const paymentLabel = {
  paid: "Paid",
  unpaid: "Unpaid",
  refunded: "Refunded",
  failed: "Failed",
} as const;
