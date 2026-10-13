export function formatPublishedDate(
  value: string | null | undefined,
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** Human-friendly relative time, e.g. "3 hours ago", "just now". */
export function formatRelativeTime(
  value: string | null | undefined,
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absolute = Math.abs(seconds);
  if (absolute < 45) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, unitSeconds] of RELATIVE_UNITS) {
    if (absolute >= unitSeconds) {
      return rtf.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return "just now";
}

/** Absolute date/time for CMS lists, e.g. "22 Jul 2026, 09:15". */
export function formatAbsoluteDateTime(
  value: string | null | undefined,
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${datePart}, ${timePart}`;
}

export function calculateReadingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const visible = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]*>/g, " ")
    .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, " ");
  const words = visible.match(/[\p{L}\p{N}]+(?:['’‘ʼʻ\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractYoutubeId(url: string): string | null {
  try {
    const value = new URL(url);
    if (!["http:", "https:"].includes(value.protocol) || value.username || value.password) return null;
    const parts = value.pathname.split("/").filter(Boolean);
    const hosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"];
    const id = value.hostname === "youtu.be" ? parts[0]
      : hosts.includes(value.hostname) ? (parts[0] === "watch" ? value.searchParams.get("v")
        : ["shorts", "embed"].includes(parts[0]) ? parts[1] : null) : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function getYoutubeThumbnail(url: string): string | null {
  return getYoutubeThumbnailCandidates(url)[0] ?? null;
}

/** Highest quality first. Availability is checked against the original image in the renderer. */
export function getYoutubeThumbnailCandidates(url: string): string[] {
  const videoId = extractYoutubeId(url);
  if (!videoId) return [];
  return ["maxresdefault", "sddefault", "hqdefault", "mqdefault"].map(
    (quality) => `https://img.youtube.com/vi/${videoId}/${quality}.jpg`,
  );
}

export function isYoutubeThumbnail(src: string, videoUrl: string): boolean {
  const id = extractYoutubeId(videoUrl);
  if (!id) return false;
  try {
    const image = new URL(src);
    return ["img.youtube.com", "i.ytimg.com"].includes(image.hostname)
      && image.pathname.startsWith(`/vi/${id}/`);
  } catch { return false; }
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
