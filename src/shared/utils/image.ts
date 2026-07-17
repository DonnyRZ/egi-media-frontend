import {
  PLACEHOLDER_IMAGE_BASE,
  UNRESOLVABLE_IMAGE_HOSTS,
} from "@/shared/constants/site.constants";

function isUnresolvableImage(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return UNRESOLVABLE_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export function buildPlaceholderImage(
  seed: string,
  width = 800,
  height = 500,
): string {
  return `${PLACEHOLDER_IMAGE_BASE}/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function resolveImageUrl(src: string | null, seed: string): string {
  if (!src || isUnresolvableImage(src)) {
    return buildPlaceholderImage(seed);
  }
  return src;
}
