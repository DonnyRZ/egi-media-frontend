"use client";

import { useFormatter, useTranslations } from "next-intl";

import type { Notification } from "@/features/notifications/types/notification.types";
import {
  getNotificationInitial,
  isNotificationUnread,
} from "@/features/notifications/utils/notification";
import { cn } from "@/shared/lib/cn";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
}: NotificationCardProps) {
  const t = useTranslations("notifications");
  const format = useFormatter();
  const unread = isNotificationUnread(notification);
  const timestamp = notification.sentAt ?? notification.createdAt;

  return (
    <article
      className={cn(
        "flex items-start gap-4 border-l-2 bg-white px-4 py-4 transition-colors md:px-5",
        unread ? "border-accent bg-primary-100/30" : "border-transparent",
      )}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-sm font-bold text-white"
      >
        {getNotificationInitial(notification.title)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "text-sm text-ink sm:text-base",
              unread ? "font-bold" : "font-semibold",
            )}
          >
            {notification.title}
          </h3>
          {unread ? (
            <span className="flex-none rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t("new")}
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm leading-6 text-neutral-600">
          {notification.message}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <time
            className="text-xs uppercase tracking-wide text-neutral-400"
            dateTime={timestamp}
          >
            {format.relativeTime(new Date(timestamp))}
          </time>
          {unread ? (
            <button
              className="text-xs font-semibold text-primary-700 transition-colors hover:text-primary-900"
              onClick={() => onMarkAsRead(notification.id)}
              type="button"
            >
              {t("markRead")}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
