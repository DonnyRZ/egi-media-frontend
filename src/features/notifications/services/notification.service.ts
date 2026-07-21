import { getAccessToken } from "@/features/auth/utils/token-storage";
import {
  NOTIFICATION_ENDPOINTS,
  NOTIFICATION_PROXY_ENDPOINTS,
} from "@/features/notifications/constants/notification.constants";
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

// The backend read endpoints are PATCH, which its CORS policy blocks in the
// browser. These calls go through same-origin Next.js route handlers that
// forward the request to the backend server-to-server.
async function patchViaProxy(path: string): Promise<void> {
  const token = getAccessToken();
  const response = await fetch(path, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Notification update failed with status ${response.status}`);
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await patchViaProxy(NOTIFICATION_PROXY_ENDPOINTS.markRead(id));
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await patchViaProxy(NOTIFICATION_PROXY_ENDPOINTS.markAllRead);
}
