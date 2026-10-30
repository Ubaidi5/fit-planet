import type { GymDoc } from "@/server/db/models";
import { moderateGymAction } from "@/actions/admin";
import { ActionButton, Pill } from "./bits";

/** Verify, feature and suspend buttons, showing only the steps that fit the listing's state */
export function GymActions({ gym }: { gym: Pick<GymDoc, "_id" | "status" | "isVerified" | "isFeatured"> }) {
  const id = gym._id.toHexString();
  return (
    <div className="flex flex-wrap gap-2">
      {gym.status !== "suspended" && (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: gym.isVerified ? "unverify" : "verify" }} tone={gym.isVerified ? "default" : "primary"}>
          {gym.isVerified ? "Unverify" : "Verify"}
        </ActionButton>
      )}
      {gym.status === "published" && (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: gym.isFeatured ? "unfeature" : "feature" }}>
          {gym.isFeatured ? "Unfeature" : "Feature"}
        </ActionButton>
      )}
      {gym.status === "suspended" ? (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "restore" }}>
          Restore as draft
        </ActionButton>
      ) : (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "suspend" }} tone="danger">
          Suspend
        </ActionButton>
      )}
    </div>
  );
}

export function GymStatusPill({ status }: { status: GymDoc["status"] }) {
  return <Pill tone={status === "published" ? "green" : status === "suspended" ? "red" : "gray"}>{status === "published" ? "Live" : status === "suspended" ? "Suspended" : "Draft"}</Pill>;
}
