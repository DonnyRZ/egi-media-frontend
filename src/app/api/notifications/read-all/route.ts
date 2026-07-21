import type { NextRequest } from "next/server";

import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/constants/notification.constants";
import { forwardNotificationPatch } from "@/features/notifications/server/forward-notification";

export async function PATCH(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  return forwardNotificationPatch(NOTIFICATION_ENDPOINTS.markAllRead, authorization);
}
