import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/server/env";
import { isSafeKey, type StorageProvider } from "./types";

/** Absolute directory that holds uploaded files */
export function localRoot() {
  return path.resolve(env.storage.localDir);
}

function resolveKey(key: string) {
  if (!isSafeKey(key)) throw new Error("Invalid storage key");
  const full = path.resolve(localRoot(), key);
  if (!full.startsWith(localRoot() + path.sep)) throw new Error("Invalid storage key");
  return full;
}

/**
 * Stores files on the server's disk. In production nginx serves STORAGE_LOCAL_DIR
 * at /media directly; in development `app/media/[...key]/route.ts` serves them.
 */
export const localStorageProvider: StorageProvider = {
  name: "local",

  async put({ key, body, contentType }) {
    const file = resolveKey(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
    return { key, url: this.url(key), size: body.length, contentType };
  },

  async delete(key) {
    try {
      await unlink(resolveKey(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  },

  url(key) {
    return `${env.storage.publicBaseUrl}/${key}`;
  },
};

export { resolveKey as resolveLocalKey };
