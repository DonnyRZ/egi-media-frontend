"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { NotificationCard } from "@/features/notifications/components/NotificationCard";
import { NotificationsSignInPrompt } from "@/features/notifications/components/NotificationsSignInPrompt";
import { useNotificationActions } from "@/features/notifications/hooks/useNotificationActions";
import { useNotificationsPage } from "@/features/notifications/hooks/useNotificationsPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ListSkeleton() {
  return (
    <div className="divide-y divide-neutral-100 border border-neutral-200">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex items-start gap-4 px-4 py-4 sm:px-5" key={index}>
          <Skeleton className="h-10 w-10 flex-none rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsView() {
  const t = useTranslations("notifications");
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, isError, error, refetch } = useNotificationsPage(page);
  const { markAsRead, markAllAsRead, isMarkingAll } = useNotificationActions();

  if (!isHydrated) {
    return (
      <Section className="pt-8 lg:pt-10">
        <Container>
          <ListSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section className="pt-8 lg:pt-10">
        <Container>
          <NotificationsSignInPrompt />
        </Container>
      </Section>
    );
  }

  const hasItems = Boolean(data?.items.length);

  return (
    <Section className="pt-8 lg:pt-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
          <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
            {t("title")}
          </h2>
          <button
            className="text-xs font-semibold uppercase tracking-wide text-primary-700 transition-colors hover:text-primary-900 disabled:cursor-not-allowed disabled:text-neutral-400"
            disabled={!data || data.unreadCount === 0 || isMarkingAll}
            onClick={markAllAsRead}
            type="button"
          >
            {t("markAllRead")}
          </button>
        </div>

        {isLoading ? <ListSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !hasItems ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && hasItems && data ? (
          <div className="space-y-8">
            <div className="divide-y divide-neutral-100 border border-neutral-200">
              {data.items.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
            <Pagination
              basePath="/notifications"
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
