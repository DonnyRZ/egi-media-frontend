"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ForYouEmptyState } from "@/features/for-you/components/ForYouEmptyState";
import { ForYouGuestCta } from "@/features/for-you/components/ForYouGuestCta";
import { usePersonalizedFeed } from "@/features/for-you/hooks/usePersonalizedFeed";
import { useMyTopicSubscriptions } from "@/features/topic-subscriptions/hooks/useMyTopicSubscriptions";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export function ForYouSection() {
  const t = useTranslations("forYou");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const feed = usePersonalizedFeed();
  const subscriptions = useMyTopicSubscriptions();

  const showGuest = isHydrated && !isAuthenticated;
  const hasSubscriptions = Boolean(subscriptions.data?.total);
  const hasItems = Boolean(feed.data?.items.length);
  const isLoading =
    !isHydrated ||
    (isAuthenticated && (feed.isLoading || subscriptions.isLoading));

  return (
    <Section ariaLabelledby="for-you-heading" dense>
      <Container>
        <SectionHeading
          actionHref={isAuthenticated ? "/for-you" : "/register"}
          actionLabel={isAuthenticated ? t("viewAll") : t("guestSignUpCta")}
          id="for-you-heading"
          subtitle={t("subtitle")}
          title={t("title")}
        />

        {isLoading ? (
          <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="space-y-3 bg-white p-5" key={index}>
                <Skeleton className="aspect-[16/10] w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && showGuest ? <ForYouGuestCta /> : null}

        {!isLoading && isAuthenticated && feed.isError ? (
          <ErrorState
            message={feed.error?.message}
            onRetry={() => void feed.refetch()}
          />
        ) : null}

        {!isLoading && isAuthenticated && !feed.isError && !hasSubscriptions ? (
          <ForYouEmptyState />
        ) : null}

        {!isLoading &&
        isAuthenticated &&
        !feed.isError &&
        hasSubscriptions &&
        !hasItems ? (
          <ForYouEmptyState />
        ) : null}

        {!isLoading && isAuthenticated && !feed.isError && hasItems && feed.data ? (
          <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {feed.data.items.map((article) => (
              <ArticleCard
                article={article}
                className="bg-white p-5"
                key={article.id}
              />
            ))}
            <GridFillers count={feed.data.items.length} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
