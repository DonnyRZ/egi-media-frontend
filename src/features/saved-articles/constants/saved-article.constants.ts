export const SAVED_ARTICLE_ENDPOINTS = {
  list: "/api/v1/articles/saved",
  save: (id: string) => `/api/v1/articles/${encodeURIComponent(id)}/save`,
} as const;

export const SAVED_ARTICLE_PAGE_LIMIT = 12;

export const SAVED_ARTICLE_STALE_TIME_MS = 60 * 1000;

export const SAVED_ARTICLE_STORAGE_PREFIX = "saved_articles";

export const ALREADY_SAVED_STATUS = 409;

export const NOT_FOUND_STATUS = 404;
