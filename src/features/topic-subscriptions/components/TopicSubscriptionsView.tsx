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
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ListSkeleton() {
  return (
    <div className="space-y-8">
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
      <Section>
        <Container>
          <ListSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <TopicSubscriptionsSignInPrompt />
        </Container>
      </Section>
    );
  }

  const isLoading = catalog.isLoading || (isAuthenticated && mine.isLoading);
  // Catalog is required to render the page; mine failure falls back to zero subscriptions.
  const isCatalogError = catalog.isError;
  const groups = catalog.data?.groups ?? [];
  const hasGroups = groups.length > 0;

  return (
    <Section>
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
          <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
            {t("listingHeading")}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {t("subscribedCount", { count: subscribedCount })}
          </p>
        </div>

        {isLoading ? <ListSkeleton /> : null}

        {!isLoading && isCatalogError ? (
          <ErrorState
            message={
              catalog.error instanceof Error ? catalog.error.message : undefined
            }
            onRetry={() => {
              void catalog.refetch();
              void mine.refetch();
            }}
          />
        ) : null}

        {!isLoading && !isCatalogError && !hasGroups ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isCatalogError && hasGroups ? (
          <div className="space-y-10">
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
      </Container>
    </Section>
  );
}
