"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  NOTIFICATION_PAGE_LIMIT,
  NOTIFICATION_STALE_TIME_MS,
} from "@/features/notifications/constants/notification.constants";
import { fetchNotifications } from "@/features/notifications/services/notification.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNotificationsPage(page = 1) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const params = { section: "page", page, limit: NOTIFICATION_PAGE_LIMIT };

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: () =>
      fetchNotifications({ page, limit: NOTIFICATION_PAGE_LIMIT }),
    enabled: isAuthenticated,
    staleTime: NOTIFICATION_STALE_TIME_MS,
  });
}
