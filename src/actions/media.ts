"use server";

import type { ActionResult } from "@/lib/types";
import { getSessionUser } from "@/server/session";
import { MediaError, saveUpload } from "@/server/modules/media";
import { fail } from "./utils";
import { allow } from "@/server/rate-limit";
import { reportError } from "@/lib/monitoring";

/** Generic upload used by avatar and gym photo pickers. Returns the public URL. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const user = await getSessionUser();
  if (!user) return fail("signInAgain");
  if (!(await allow("upload", user._id.toHexString(), 60, 3600))) return fail("tooManyAttempts");
  const file = formData.get("file");
  const requested = formData.get("folder");
  const folder = requested === "gyms" || requested === "posts" ? requested : "avatars";
  if (!(file instanceof File) || file.size === 0) return fail("chooseFile");
  try {
    const url = await saveUpload(user._id, folder, file);
    return { ok: true, data: { url } };
  } catch (error) {
    if (error instanceof MediaError) return fail(error.key, error.values);
    reportError("[media] upload failed", error);
    return fail("uploadFailed");
  }
}
