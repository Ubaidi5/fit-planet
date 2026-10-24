import "server-only";
import { env } from "@/server/env";
import type { StorageProvider } from "./types";
import { localStorageProvider } from "./local";
import { s3StorageProvider } from "./s3";

export * from "./types";

const providers: Record<string, StorageProvider> = {
  local: localStorageProvider,
  s3: s3StorageProvider,
};

/** The active storage provider, chosen by STORAGE_PROVIDER */
export function storage(): StorageProvider {
  return providers[env.storage.provider] ?? localStorageProvider;
}

/** Maps a public URL back to its storage key, or null if it isn't one of ours */
export function keyFromUrl(url: string): string | null {
  const base = env.storage.publicBaseUrl;
  return url.startsWith(`${base}/`) ? url.slice(base.length + 1) : null;
}
