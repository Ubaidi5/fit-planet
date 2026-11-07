import "server-only";
import { AppError } from "@/server/errors";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { collections } from "@/server/db/collections";
import { env } from "@/server/env";
import { extensionFor, IMAGE_TYPES, keyFromUrl, storage, VIDEO_TYPES } from "@/server/services/storage";
import { reportError } from "@/lib/monitoring";

export class MediaError extends AppError {}

export type MediaFolder = "gyms" | "avatars" | "posts";

const ascii = (bytes: Buffer, start: number, end: number) => bytes.subarray(start, end).toString("latin1");

/**
 * The browser-reported type is only a claim, so check the file's first bytes
 * match it. Stops an HTML or SVG file being stored as a "photo".
 */
function contentMatches(type: string, head: Buffer) {
  switch (type) {
    case "image/jpeg":
      return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
    case "image/png":
      return head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return ascii(head, 0, 6) === "GIF87a" || ascii(head, 0, 6) === "GIF89a";
    case "image/webp":
      return ascii(head, 0, 4) === "RIFF" && ascii(head, 8, 12) === "WEBP";
    case "image/avif":
      return ascii(head, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(head, 8, 12));
    case "video/mp4":
    case "video/quicktime":
      return ascii(head, 4, 8) === "ftyp";
    case "video/webm":
      return head.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    default:
      return false;
  }
}

/** Validates and stores an uploaded file, returning its public URL */
export async function saveUpload(ownerId: ObjectId, folder: MediaFolder, file: File, options: { allowVideo?: boolean } = {}) {
  const allowed: readonly string[] = options.allowVideo ? [...IMAGE_TYPES, ...VIDEO_TYPES] : IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    throw new MediaError(options.allowVideo ? "mediaType" : "imageType");
  }
  const maxBytes = env.storage.maxUploadMb * 1024 * 1024;
  if (file.size > maxBytes) throw new MediaError("fileTooBig", { mb: env.storage.maxUploadMb });

  const body = Buffer.from(await file.arrayBuffer());
  if (!contentMatches(file.type, body)) throw new MediaError(options.allowVideo ? "mediaType" : "imageType");
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
    reportError("[media] delete failed", error);
  }
}

/** The subset of these URLs that this person uploaded themselves */
export async function ownedUploads(ownerId: ObjectId, urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();
  const docs = await (await collections.media()).find({ ownerId, url: { $in: urls } }, { projection: { url: 1 } }).toArray();
  return new Set(docs.map((d) => d.url));
}
