"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notifications/services/notification.service";
import type { NotificationListResult } from "@/features/notifications/types/notification.types";
import {
  markListAllRead,
  markListItemRead,
} from "@/features/notifications/utils/notification";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

type ListUpdater = (list: NotificationListResult) => NotificationListResult;
type ListSnapshot = [readonly unknown[], NotificationListResult | undefined][];

async function applyOptimistic(
  queryClient: QueryClient,
  updater: ListUpdater,
): Promise<ListSnapshot> {
  const filter = { queryKey: QUERY_KEYS.notifications.all };
  await queryClient.cancelQueries(filter);
  const snapshot =
    queryClient.getQueriesData<NotificationListResult>(filter);
  queryClient.setQueriesData<NotificationListResult>(filter, (old) =>
    old ? updater(old) : old,
  );
  return snapshot;
}

function restore(queryClient: QueryClient, snapshot: ListSnapshot) {
  snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onMutate: (id) =>
      applyOptimistic(queryClient, (list) => markListItemRead(list, id)),
    onError: (_error, _id, snapshot) =>
      snapshot ? restore(queryClient, snapshot) : undefined,
    onSettled: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: () => applyOptimistic(queryClient, markListAllRead),
    onError: (_error, _vars, snapshot) =>
      snapshot ? restore(queryClient, snapshot) : undefined,
    onSettled: invalidate,
  });

  return {
    markAsRead: (id: string) => markRead.mutate(id),
    markAllAsRead: () => markAllRead.mutate(),
    isMarkingAll: markAllRead.isPending,
  };
}
