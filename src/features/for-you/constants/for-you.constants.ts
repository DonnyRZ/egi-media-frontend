export const PERSONALIZED_FEED_ENDPOINTS = {
  list: "/api/v1/articles/personalized",
} as const;

export const PERSONALIZED_FEED_LIMIT = 6;
export const PERSONALIZED_FEED_PAGE_LIMIT = 12;
export const PERSONALIZED_FEED_STALE_TIME_MS = 60_000;
