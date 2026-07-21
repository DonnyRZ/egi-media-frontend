"use client";

import { useTranslations } from "next-intl";

import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import type { Notification } from "@/features/notifications/types/notification.types";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  isMarkingAll: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewAll: () => void;
}

function PanelState({ message }: { message: string }) {
  return (
    <p className="px-4 py-10 text-center text-sm text-neutral-500">{message}</p>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4">
      {[0, 1, 2].map((index) => (
        <div className="flex items-start gap-3" key={index}>
          <Skeleton className="h-8 w-8 flex-none rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationPanel({
  notifications,
  unreadCount,
  isLoading,
  isError,
  isMarkingAll,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
}: NotificationPanelProps) {
  const t = useTranslations("notifications");
  const hasItems = notifications.length > 0;

  return (
    <div
      className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] border border-neutral-200 bg-white shadow-xl"
      role="menu"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink">
            {t("title")}
          </h2>
          {unreadCount > 0 ? (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>
        <button
          className="text-xs font-semibold text-primary-700 transition-colors hover:text-primary-900 disabled:cursor-not-allowed disabled:text-neutral-400"
          disabled={unreadCount === 0 || isMarkingAll}
          onClick={onMarkAllAsRead}
          type="button"
        >
          {t("markAllRead")}
        </button>
      </div>

      <div className="max-h-[24rem] divide-y divide-neutral-100 overflow-y-auto">
        {isLoading ? <PanelSkeleton /> : null}
        {!isLoading && isError ? <PanelState message={t("error")} /> : null}
        {!isLoading && !isError && !hasItems ? (
          <PanelState message={t("empty")} />
        ) : null}
        {!isLoading && !isError && hasItems
          ? notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          : null}
      </div>

      <div className="border-t border-neutral-200">
        <Link
          className="block px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-primary-700 transition-colors hover:bg-neutral-50 hover:text-primary-900"
          href="/notifications"
          onClick={onViewAll}
          role="menuitem"
        >
          {t("viewAll")}
        </Link>
      </div>
    </div>
  );
}
