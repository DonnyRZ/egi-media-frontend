export const NOTIFICATION_ENDPOINTS = {
  list: "/api/v1/notifications",
  markRead: (id: string) =>
    `/api/v1/notifications/${encodeURIComponent(id)}/read`,
  markAllRead: "/api/v1/notifications/read-all",
} as const;

export const NOTIFICATION_PREVIEW_LIMIT = 8;

export const NOTIFICATION_PAGE_LIMIT = 20;

export const NOTIFICATION_STALE_TIME_MS = 60 * 1000;

export const NOTIFICATION_REFETCH_INTERVAL_MS = 60 * 1000;
