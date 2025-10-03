"use client";

import { isCorsOriginError } from "next-sanity";
import { toast } from "sonner";

export function handleError(error: unknown) {
  if (isCorsOriginError(error)) {
    // If the error is a CORS origin error, let's display that specific error.
    const { addOriginUrl } = error;
    toast.error(`Sanity Live couldn't connect`, {
      description: `Your origin is blocked by CORS policy`,
      duration: Infinity,
      action: addOriginUrl
        ? {
            label: "Manage",
            onClick: () => window.open(addOriginUrl.toString(), "_blank"),
          }
        : undefined,
    });
  } else if (error instanceof Error) {
    console.error(error);
    toast.error(error.name, { description: error.message, duration: Infinity });
  } else {
    console.error(error);
    toast.error("Unknown error", {
      description: "Check the console for more details",
      duration: Infinity,
    });
  }
}

// Draft-mode safe string cleaner: removes invisible Unicode control chars
export function cleanStringDraftSafe(str: string | undefined): string | undefined {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u200B-\u200D\uFEFF\u2060-\u2064\u206A-\u206F]/g, '').trim();
}

// Validates that a key exists in a mapping; returns a safe default if not
export function getValidKeyOrDefault<K extends string, T extends Record<string, unknown>>(
  raw: K | undefined,
  map: T,
  fallback: K
): K {
  const cleaned = cleanStringDraftSafe(raw as unknown as string) as K | undefined;
  if (cleaned && Object.prototype.hasOwnProperty.call(map, cleaned)) {
    return cleaned as K;
  }
  return fallback;
}

// Hex color validator with draft-safe cleaning
export function getValidHexColorOrDefault(
  raw: string | undefined,
  fallback: string
): string {
  const cleaned = cleanStringDraftSafe(raw);
  return typeof cleaned === 'string' && /^#[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned : fallback;
}
