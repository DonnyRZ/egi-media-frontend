import { FALLBACK_ARTICLE_IMAGE } from "@/shared/constants/site.constants";

/** Invalid URLs render the local placeholder instead of throwing inside Next Image. */
export function safeImageSource(src: string | null) {
  if (!src) return FALLBACK_ARTICLE_IMAGE;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  try {
    const url = new URL(src);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return FALLBACK_ARTICLE_IMAGE;
    return src;
  } catch {
    return FALLBACK_ARTICLE_IMAGE;
  }
}

export function imageNeedsDirectLoad(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "http:" && url.hostname !== "localhost";
  } catch {
    return false;
  }
}
