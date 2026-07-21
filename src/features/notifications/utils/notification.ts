import type {
  Notification,
  NotificationListResult,
} from "@/features/notifications/types/notification.types";

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

function toReadNotification(notification: Notification): Notification {
  if (!isNotificationUnread(notification)) return notification;
  return { ...notification, status: "read", readAt: new Date().toISOString() };
}

export function markListItemRead(
  list: NotificationListResult,
  id: string,
): NotificationListResult {
  const wasUnread = list.items.some(
    (item) => item.id === id && isNotificationUnread(item),
  );
  const items = list.items.map((item) =>
    item.id === id ? toReadNotification(item) : item,
  );
  const unreadCount = wasUnread
    ? Math.max(0, list.unreadCount - 1)
    : list.unreadCount;
  return { ...list, items, unreadCount };
}

export function markListAllRead(
  list: NotificationListResult,
): NotificationListResult {
  return {
    ...list,
    items: list.items.map(toReadNotification),
    unreadCount: 0,
  };
}
