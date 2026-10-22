"use server";

import type { ActionResult } from "@/lib/types";
import { getSessionUser } from "@/server/session";
import { MediaError, saveUpload } from "@/server/modules/media";

/** Generic upload used by avatar and gym photo pickers. Returns the public URL. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const file = formData.get("file");
  const folder = formData.get("folder") === "gyms" ? "gyms" : "avatars";
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a file to upload." };
  try {
    const url = await saveUpload(user._id, folder, file);
    return { ok: true, data: { url } };
  } catch (error) {
    if (error instanceof MediaError) return { ok: false, error: error.message };
    console.error("[media] upload failed", error);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
