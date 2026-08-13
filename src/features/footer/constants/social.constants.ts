export const SOCIAL_ICON_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "spotify", label: "Spotify" },
  { value: "twitter", label: "X (Twitter)" },
] as const;

export type SocialPlatform = (typeof SOCIAL_ICON_OPTIONS)[number]["value"];

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_ICON_OPTIONS.some((option) => option.value === value);
}
