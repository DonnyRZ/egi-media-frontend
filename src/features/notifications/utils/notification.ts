import type { Notification } from "@/features/notifications/types/notification.types";

export function isNotificationUnread(notification: Notification): boolean {
  return notification.status !== "read" && notification.readAt === null;
}

export function getNotificationInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || "N";
}

export function filterOwnNotifications(
  items: Notification[],
  userId: string | undefined,
): Notification[] {
  if (!userId) return [];
  return items.filter((item) => item.userId === userId);
}
