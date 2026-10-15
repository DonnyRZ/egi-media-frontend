"use client";

import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { usePersonalizedFeed } from "@/features/for-you/hooks/usePersonalizedFeed";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";

export function ForYouSection() {
  const t = useTranslations("forYou");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const feed = usePersonalizedFeed();
  const items = feed.data?.items ?? [];

  // The homepage only reserves space for actual recommendations. Account and
  // preference guidance remains available on the dedicated For You page.
  if (!isHydrated || !isAuthenticated || !items.length) return null;

  return (
    <FrameModule ariaLabelledby="for-you-heading" className="homepage-for-you">
      <FrameHeading
        actionHref="/for-you"
        actionLabel={t("viewAll")}
        id="for-you-heading"
        title={t("title")}
      />

      {feed.isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState
            message={feed.error?.message}
            onRetry={() => void feed.refetch()}
          />
        </div>
      ) : null}

      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard
            article={article}
            className="editorial-gutter bg-white px-4 py-5 md:p-5"
            key={article.id}
          />
        ))}
        <GridFillers count={items.length} />
      </div>
    </FrameModule>
  );
}
