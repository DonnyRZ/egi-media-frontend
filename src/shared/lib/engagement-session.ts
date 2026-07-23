/**
 * Records engagement views with Strict Mode–safe dedupe.
 * A short recent window prevents double POSTs on remount,
 * while still counting again on a real revisit.
 */

const inFlight = new Map<string, Promise<number | null>>();
const recent = new Map<string, { count: number | null; at: number }>();

/** Ignore duplicate mounts within this window (React Strict Mode). */
const DEDUPE_MS = 2_500;

export function articleViewSessionKey(articleId: string): string {
  return `egi-article-view:${articleId}`;
}

export function columnViewSessionKey(columnId: string): string {
  return `egi-column-view:${columnId}`;
}

/**
 * Fires at most one view POST per key within DEDUPE_MS.
 * Remounts reuse the same promise / cached count so the UI can update.
 */
export function recordViewOnce(
  storageKey: string,
  track: () => Promise<number | null>,
): Promise<number | null> {
  const cached = recent.get(storageKey);
  if (cached && Date.now() - cached.at < DEDUPE_MS) {
    return Promise.resolve(cached.count);
  }

  const existing = inFlight.get(storageKey);
  if (existing) return existing;

  const request = track()
    .then((count) => {
      recent.set(storageKey, { count, at: Date.now() });
      return count;
    })
    .finally(() => {
      inFlight.delete(storageKey);
    });

  inFlight.set(storageKey, request);
  return request;
}
