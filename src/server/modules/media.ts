import "server-only";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import { env } from "@/server/env";
import { extensionFor, IMAGE_TYPES, keyFromUrl, storage, VIDEO_TYPES } from "@/server/services/storage";

export class MediaError extends Error {}

export type MediaFolder = "gyms" | "avatars";

/** Validates and stores an uploaded file, returning its public URL */
export async function saveUpload(ownerId: ObjectId, folder: MediaFolder, file: File, options: { allowVideo?: boolean } = {}) {
  const allowed: readonly string[] = options.allowVideo ? [...IMAGE_TYPES, ...VIDEO_TYPES] : IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    throw new MediaError(options.allowVideo ? "Use a JPG, PNG, WebP or MP4 file." : "Use a JPG, PNG or WebP image.");
  }
  const maxBytes = env.storage.maxUploadMb * 1024 * 1024;
  if (file.size > maxBytes) throw new MediaError(`Files can be up to ${env.storage.maxUploadMb} MB.`);

  const body = Buffer.from(await file.arrayBuffer());
  const key = `${folder}/${ownerId.toHexString()}/${randomUUID()}.${extensionFor(file.type)}`;
  const provider = storage();
  const stored = await provider.put({ key, body, contentType: file.type });

  await (await collections.media()).insertOne({
    _id: new ObjectId(),
    ownerId,
    key,
    url: stored.url,
    contentType: file.type,
    size: stored.size,
    provider: provider.name,
    createdAt: new Date(),
  });
  return stored.url;
}

/** Deletes a stored file if it's one of ours and belongs to this owner */
export async function deleteUpload(ownerId: ObjectId, url: string) {
  const key = keyFromUrl(url);
  if (!key) return; // external image (e.g. seed data); nothing to delete
  const media = await collections.media();
  const doc = await media.findOneAndDelete({ key, ownerId });
  if (!doc) return;
  try {
    await storage().delete(key);
  } catch (error) {
    console.error("[media] delete failed", error);
  }
}
