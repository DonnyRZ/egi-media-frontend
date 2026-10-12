"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { TopicSubscriptionGroupBlock } from "@/features/topic-subscriptions/components/TopicSubscriptionGroup";
import { TopicSubscriptionsSignInPrompt } from "@/features/topic-subscriptions/components/TopicSubscriptionsSignInPrompt";
import { useMyTopicSubscriptions } from "@/features/topic-subscriptions/hooks/useMyTopicSubscriptions";
import { useTopicCatalog } from "@/features/topic-subscriptions/hooks/useTopicCatalog";
import { useTopicSubscriptionToggle } from "@/features/topic-subscriptions/hooks/useTopicSubscriptionToggle";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ListSkeleton() {
  return (
    <div className="space-y-8 bg-white px-4 py-5 md:p-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-3" key={index}>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

export function TopicSubscriptionsView() {
  const t = useTranslations("topicSubscriptionsPage");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const catalog = useTopicCatalog();
  const mine = useMyTopicSubscriptions();
  const { isSubscribed, isPending, errorFor, subscribedCount, toggle } =
    useTopicSubscriptionToggle();

  if (!isHydrated) {
    return (
      <FrameModule>
        <ListSkeleton />
      </FrameModule>
    );
  }

  if (!isAuthenticated) {
    return (
      <FrameModule>
        <div className="bg-white px-4 py-5 md:p-5">
          <TopicSubscriptionsSignInPrompt />
        </div>
      </FrameModule>
    );
  }

  const isLoading = catalog.isLoading || (isAuthenticated && mine.isLoading);
  // Catalog is required to render the page; mine failure falls back to zero subscriptions.
  const isCatalogError = catalog.isError;
  const groups = catalog.data?.groups ?? [];
  const hasGroups = groups.length > 0;

  return (
    <FrameModule ariaLabelledby="topic-subscriptions-listing-heading">
      <FrameHeading
        id="topic-subscriptions-listing-heading"
        subtitle={t("subscribedCount", { count: subscribedCount })}
        title={t("listingHeading")}
      />

      {isLoading ? <ListSkeleton /> : null}

      {!isLoading && isCatalogError ? (
        <div className="bg-white px-4 py-5 md:p-5">
          <ErrorState
            message={
              catalog.error instanceof Error ? catalog.error.message : undefined
            }
            onRetry={() => {
              void catalog.refetch();
              void mine.refetch();
            }}
          />
        </div>
      ) : null}

      {!isLoading && !isCatalogError && !hasGroups ? (
        <div className="bg-white px-4 py-5 md:p-5">
          <EmptyState message={t("empty")} />
        </div>
      ) : null}

      {!isLoading && !isCatalogError && hasGroups ? (
        <div className="space-y-10 bg-white px-4 py-5 md:p-5">
          {groups.map((group) => (
            <TopicSubscriptionGroupBlock
              errorFor={errorFor}
              group={group}
              isPending={isPending}
              isSubscribed={isSubscribed}
              key={group.category?.id ?? "uncategorized"}
              onToggle={(id) => void toggle(id)}
            />
          ))}
        </div>
      ) : null}
    </FrameModule>
  );
}
