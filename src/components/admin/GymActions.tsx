import type { GymDoc } from "@/server/db/models";
import { moderateGymAction, suspendAction } from "@/actions/admin";
import { reasonsFor } from "@/lib/suspension";
import { ActionButton, Pill } from "./bits";
import { SuspendForm } from "./AdminForms";

/** Verify, feature, hide and suspend buttons, showing only the steps that fit the listing's state */
export function GymActions({ gym }: { gym: Pick<GymDoc, "_id" | "status" | "isVerified" | "isFeatured" | "images"> }) {
  const id = gym._id.toHexString();
  return (
    <div className="flex flex-wrap items-start gap-2">
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
      {gym.status === "published" && (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "hide" }}>
          Hide from site
        </ActionButton>
      )}
      {gym.status === "draft" && gym.images.length > 0 && (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "publish" }}>
          Put live
        </ActionButton>
      )}
      {gym.status === "suspended" ? (
        <ActionButton action={moderateGymAction} fields={{ gymId: id, action: "restore" }}>
          Restore as draft
        </ActionButton>
      ) : (
        <SuspendForm action={suspendAction} target="gym" id={id} reasons={reasonsFor("gym")} />
      )}
    </div>
  );
}

export function GymStatusPill({ status }: { status: GymDoc["status"] }) {
  return <Pill tone={status === "published" ? "green" : status === "suspended" ? "red" : "gray"}>{status === "published" ? "Live" : status === "suspended" ? "Suspended" : "Hidden (draft)"}</Pill>;
}
