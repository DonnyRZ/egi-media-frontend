export type AdPlacement = "LEADERBOARD" | "HERO_BELOW" | "IN_FEED" | "LATEST_VIDEOS";
export type ContentGridAdPlacement = Extract<AdPlacement, "IN_FEED" | "LATEST_VIDEOS">;
export const AD_PLACEMENT_VALUES: readonly AdPlacement[] = ["LEADERBOARD", "HERO_BELOW", "IN_FEED", "LATEST_VIDEOS"];
export const AD_PLACEMENT_GUIDELINES: Record<AdPlacement, { label: string; dimensions: string; tip: string; ratio: number; aspectRatio: string }> = {
  LEADERBOARD: { label: "Homepage — Above header", dimensions: "970×250", ratio: 97 / 25, aspectRatio: "97 / 25", tip: "97:25. Centered banner, up to 970px wide. Displayed in full on a light gray background." },
  HERO_BELOW: { label: "Homepage — Below main story", dimensions: "1280×720", ratio: 16 / 9, aspectRatio: "16 / 9", tip: "16:9 landscape. Below the main story inside its desktop column; after Featured Video on mobile, or after the hero when no video is available." },
  IN_FEED: { label: "Homepage — Latest News", dimensions: "1080×1080", ratio: 1, aspectRatio: "1 / 1", tip: "1:1 square. After five articles on desktop or three on mobile." },
  LATEST_VIDEOS: { label: "Homepage — Latest Videos", dimensions: "1080×1080", ratio: 1, aspectRatio: "1 / 1", tip: "1:1 square. After five videos on desktop or three on mobile." },
};
export function isAdPlacement(value: string): value is AdPlacement {
  return AD_PLACEMENT_VALUES.includes(value as AdPlacement);
}
export function matchesAdRatio(placement: AdPlacement, width: number, height: number) {
  return width > 0 && height > 0 && Math.abs(width / height / AD_PLACEMENT_GUIDELINES[placement].ratio - 1) <= 0.005;
}
export const AD_LABELS = { id: "Iklan", en: "Advertisement", uz: "Reklama" } as const;
