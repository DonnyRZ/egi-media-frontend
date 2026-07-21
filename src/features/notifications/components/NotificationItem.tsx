"use client";

import { useFormatter, useTranslations } from "next-intl";

import type { Notification } from "@/features/notifications/types/notification.types";
import {
  getNotificationInitial,
  isNotificationUnread,
} from "@/features/notifications/utils/notification";
import { cn } from "@/shared/lib/cn";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const t = useTranslations("notifications");
  const format = useFormatter();
  const unread = isNotificationUnread(notification);
  const timestamp = notification.sentAt ?? notification.createdAt;

  function handleClick() {
    if (unread) onMarkAsRead(notification.id);
  }

  return (
    <button
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
        unread && "bg-primary-100/40",
      )}
      onClick={handleClick}
      role="menuitem"
      type="button"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
      >
        {getNotificationInitial(notification.title)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-sm text-ink",
              unread ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </span>
          {unread ? (
            <span
              aria-label={t("unread")}
              className="ml-auto h-2 w-2 flex-none rounded-full bg-accent"
            />
          ) : null}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs text-neutral-500">
          {notification.message}
        </span>
        <time
          className="mt-1 block text-[11px] uppercase tracking-wide text-neutral-400"
          dateTime={timestamp}
        >
          {format.relativeTime(new Date(timestamp))}
        </time>
      </span>
    </button>
  );
}
