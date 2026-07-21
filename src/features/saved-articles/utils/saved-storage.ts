import { SAVED_ARTICLE_STORAGE_PREFIX } from "@/features/saved-articles/constants/saved-article.constants";

function storageKey(userId: string): string {
  return `${SAVED_ARTICLE_STORAGE_PREFIX}:${userId}`;
}

export function getSavedIds(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function saveSavedIds(userId: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(ids));
}
