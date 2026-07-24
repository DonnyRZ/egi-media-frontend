export const TOPIC_SUBSCRIPTION_ENDPOINTS = {
  catalog: "/api/v1/topics/catalog",
  myTopics: "/api/v1/users/me/topics",
  subscribe: (id: string) => `/api/v1/users/me/topics/${id}`,
} as const;

export const ALREADY_SUBSCRIBED_STATUS = 409;
export const NOT_FOUND_STATUS = 404;
export const TOPIC_SUBSCRIPTION_STALE_TIME_MS = 60_000;
