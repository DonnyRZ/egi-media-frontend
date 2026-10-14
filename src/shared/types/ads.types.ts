export type AdPlacement = "LEADERBOARD" | "IN_FEED" | "LATEST_VIDEOS";
export const AD_PLACEMENT_VALUES: readonly AdPlacement[] = ["LEADERBOARD", "IN_FEED", "LATEST_VIDEOS"];
export const AD_PLACEMENT_GUIDELINES: Record<AdPlacement, { label: string; dimensions: string; tip: string; ratio: number; aspectRatio: string }> = {
  LEADERBOARD: { label: "Homepage — Above header", dimensions: "1920×367", ratio: 1920 / 367, aspectRatio: "1920 / 367", tip: "1920:367. Full-width banner, displayed without cropping. Existing images retain their original proportions." },
  IN_FEED: { label: "Homepage — Latest News", dimensions: "1280×720", ratio: 16 / 9, aspectRatio: "16 / 9", tip: "16:9. After five articles on desktop or three on mobile." },
  LATEST_VIDEOS: { label: "Homepage — Latest Videos", dimensions: "1280×720", ratio: 16 / 9, aspectRatio: "16 / 9", tip: "16:9. After five videos on desktop or three on mobile." },
};
export function isAdPlacement(value: string): value is AdPlacement {
  return AD_PLACEMENT_VALUES.includes(value as AdPlacement);
}
export function matchesAdRatio(placement: AdPlacement, width: number, height: number) {
  return width > 0 && height > 0 && Math.abs(width / height / AD_PLACEMENT_GUIDELINES[placement].ratio - 1) <= 0.005;
}
export const AD_LABELS = { id: "Iklan", en: "Advertisement", uz: "Reklama" } as const;
