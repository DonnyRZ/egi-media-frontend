"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  NOTIFICATION_PREVIEW_LIMIT,
  NOTIFICATION_REFETCH_INTERVAL_MS,
  NOTIFICATION_STALE_TIME_MS,
} from "@/features/notifications/constants/notification.constants";
import { fetchNotifications } from "@/features/notifications/services/notification.service";
import { filterOwnNotifications } from "@/features/notifications/utils/notification";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNotifications() {
  const userId = useAuthStore((state) => state.user?.id);
  const requestParams = { page: 1, limit: NOTIFICATION_PREVIEW_LIMIT };

  const query = useQuery({
    queryKey: QUERY_KEYS.notifications.list({ userId, ...requestParams }),
    queryFn: () => fetchNotifications(requestParams),
    enabled: Boolean(userId),
    staleTime: NOTIFICATION_STALE_TIME_MS,
    refetchInterval: NOTIFICATION_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
    select: (result) => ({
      ...result,
      items: filterOwnNotifications(result.items, userId),
    }),
  });

  return {
    notifications: query.data?.items ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
