"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/services/notification.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: invalidate,
  });

  return {
    markAsRead: (id: string) => markRead.mutate(id),
    markAllAsRead: () => markAllRead.mutate(),
    isMarkingAll: markAllRead.isPending,
  };
}
