export type AdPlacement = "LEADERBOARD" | "IN_FEED" | "SIDEBAR_RECTANGLE";

export const AD_PLACEMENT_VALUES: readonly AdPlacement[] = [
  "LEADERBOARD",
  "IN_FEED",
  "SIDEBAR_RECTANGLE",
] as const;

export const AD_PLACEMENT_GUIDELINES: Record<
  AdPlacement,
  { label: string; dimensions: string; tip: string }
> = {
  LEADERBOARD: {
    label: "Leaderboard (homepage header)",
    dimensions: "840×360",
    tip: "Centered header banner. Full artwork is visible at a readable size without dominating the page.",
  },
  IN_FEED: {
    label: "In-feed (category grid card)",
    dimensions: "16:10 aspect (e.g. 800×500)",
    tip: "Matches article card ratio. Keep text clear at card size.",
  },
  SIDEBAR_RECTANGLE: {
    label: "Sidebar (Top Stories column)",
    dimensions: "300×250",
    tip: "Medium rectangle. Fits the homepage right column under Top Stories.",
  },
};

export function isAdPlacement(value: string): value is AdPlacement {
  return (AD_PLACEMENT_VALUES as readonly string[]).includes(value);
}
