"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { BellIcon } from "@/features/notifications/components/BellIcon";
import { NotificationPanel } from "@/features/notifications/components/NotificationPanel";
import { useNotificationActions } from "@/features/notifications/hooks/useNotificationActions";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const t = useTranslations("notifications");
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  const { notifications, unreadCount, isLoading, isError } = useNotifications();
  const { markAsRead, markAllAsRead, isMarkingAll } = useNotificationActions();

  if (!isHydrated || !user) return null;

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const ariaLabel =
    unreadCount > 0 ? t("ariaWithCount", { count: unreadCount }) : t("aria");

  return (
    <div className={className} ref={ref}>
      <div className="relative">
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={ariaLabel}
          className="relative flex min-h-11 min-w-11 items-center justify-center rounded p-1.5 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
              {badgeLabel}
            </span>
          ) : null}
        </button>

        {open ? (
          <NotificationPanel
            isError={isError}
            isLoading={isLoading}
            isMarkingAll={isMarkingAll}
            notifications={notifications}
            onMarkAllAsRead={markAllAsRead}
            onMarkAsRead={markAsRead}
            onViewAll={() => setOpen(false)}
            unreadCount={unreadCount}
          />
        ) : null}
      </div>
    </div>
  );
}
