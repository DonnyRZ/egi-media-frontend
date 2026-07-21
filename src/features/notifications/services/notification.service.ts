import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/constants/notification.constants";
import {
  mapNotificationList,
  type NotificationListDto,
} from "@/features/notifications/mappers/notification.mapper";
import type {
  NotificationListParams,
  NotificationListResult,
} from "@/features/notifications/types/notification.types";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

export async function fetchNotifications(
  params: NotificationListParams = {},
): Promise<NotificationListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<NotificationListDto>
  >(NOTIFICATION_ENDPOINTS.list, { params });
  return mapNotificationList(response.data.data);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await axiosClient.patch(NOTIFICATION_ENDPOINTS.markRead(id));
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosClient.patch(NOTIFICATION_ENDPOINTS.markAllRead);
}
