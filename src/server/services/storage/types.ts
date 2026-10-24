/**
 * File storage contract. The default `local` provider writes to disk on the
 * Lightsail server; `s3` talks to any S3-compatible bucket (AWS S3, Cloudflare R2,
 * MinIO, Garage). Switching is a STORAGE_PROVIDER change plus moving files.
 */

export interface PutObjectInput {
  /** Path inside the bucket, e.g. gyms/<id>/<uuid>.webp */
  key: string;
  body: Buffer;
  contentType: string;
}

export interface StoredObject {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface StorageProvider {
  readonly name: string;
  put(input: PutObjectInput): Promise<StoredObject>;
  delete(key: string): Promise<void>;
  /** Public URL for a stored key */
  url(key: string): string;
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export function extensionFor(contentType: string) {
  return EXTENSIONS[contentType] ?? "bin";
}

/** Keys only ever contain safe characters, so they can't escape the storage root */
export function isSafeKey(key: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/.test(key) && !key.includes("..");
}
