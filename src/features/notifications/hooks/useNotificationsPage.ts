"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  NOTIFICATION_PAGE_LIMIT,
  NOTIFICATION_STALE_TIME_MS,
} from "@/features/notifications/constants/notification.constants";
import { fetchNotifications } from "@/features/notifications/services/notification.service";
import { filterOwnNotifications } from "@/features/notifications/utils/notification";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNotificationsPage(page = 1) {
  const userId = useAuthStore((state) => state.user?.id);
  const params = { section: "page", userId, page, limit: NOTIFICATION_PAGE_LIMIT };

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: () =>
      fetchNotifications({ page, limit: NOTIFICATION_PAGE_LIMIT }),
    enabled: Boolean(userId),
    staleTime: NOTIFICATION_STALE_TIME_MS,
    select: (result) => ({
      ...result,
      items: filterOwnNotifications(result.items, userId),
    }),
  });
}
