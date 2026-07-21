import type { NextRequest } from "next/server";

import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/constants/notification.constants";
import { forwardNotificationPatch } from "@/features/notifications/server/forward-notification";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const authorization = request.headers.get("authorization") ?? "";
  return forwardNotificationPatch(NOTIFICATION_ENDPOINTS.markRead(id), authorization);
}
