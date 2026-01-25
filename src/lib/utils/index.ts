import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge and dedupe Tailwind CSS classes
 * Uses clsx for conditional class handling and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returning disabled: false as default.
export function extractFloatingIconsBlock(settingsData: string): boolean {
  try {
    const settings = JSON.parse(settingsData);

    if (!settings.current.blocks) return false;

    for (let key in settings.current.blocks) {
      if (settings.current?.blocks[key]?.type?.includes("floating-icons")) {
        return settings.current?.blocks[key]?.disabled;
      }
    }

    return false;
  } catch (error) {
    console.error("Error in ***extractFloatingIconsBlock***: \n", error);
    return false;
  }
}
