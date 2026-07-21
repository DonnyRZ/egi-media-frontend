export const NEWSLETTER_ENDPOINTS = {
  list: "/api/v1/newsletters",
  subscribe: (id: string) =>
    `/api/v1/newsletters/${encodeURIComponent(id)}/subscribe`,
} as const;

export const NEWSLETTER_PAGE_LIMIT = 12;

export const NEWSLETTER_STALE_TIME_MS = 5 * 60 * 1000;

export const NEWSLETTER_SUBSCRIPTIONS_STORAGE_PREFIX = "newsletter_subs";

export const ALREADY_SUBSCRIBED_STATUS = 409;
