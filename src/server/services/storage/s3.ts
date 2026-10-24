import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/server/env";
import type { StorageProvider } from "./types";

let client: S3Client | null = null;

function s3() {
  const cfg = env.storage.s3;
  if (!cfg.bucket || !cfg.accessKeyId || !cfg.secretAccessKey) {
    throw new Error("S3 storage needs S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY");
  }
  client ??= new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: cfg.forcePathStyle,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  });
  return client;
}

/** Any S3-compatible bucket: AWS S3, Cloudflare R2, MinIO, Garage */
export const s3StorageProvider: StorageProvider = {
  name: "s3",

  async put({ key, body, contentType }) {
    await s3().send(
      new PutObjectCommand({
        Bucket: env.storage.s3.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return { key, url: this.url(key), size: body.length, contentType };
  },

  async delete(key) {
    await s3().send(new DeleteObjectCommand({ Bucket: env.storage.s3.bucket, Key: key }));
  },

  url(key) {
    // STORAGE_PUBLIC_URL should point at the bucket's public domain or CDN
    return `${env.storage.publicBaseUrl}/${key}`;
  },
};
