"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  NOTIFICATION_PREVIEW_LIMIT,
  NOTIFICATION_REFETCH_INTERVAL_MS,
  NOTIFICATION_STALE_TIME_MS,
} from "@/features/notifications/constants/notification.constants";
import { fetchNotifications } from "@/features/notifications/services/notification.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNotifications() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const params = { page: 1, limit: NOTIFICATION_PREVIEW_LIMIT };

  const query = useQuery({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: () => fetchNotifications(params),
    enabled: isAuthenticated,
    staleTime: NOTIFICATION_STALE_TIME_MS,
    refetchInterval: NOTIFICATION_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  return {
    notifications: query.data?.items ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
