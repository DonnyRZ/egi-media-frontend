"use client";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useLatestNews } from "@/features/homepage/hooks/useLatestNews";

export function LatestNewsSection() {
  const { data, isLoading, isError, error, refetch } = useLatestNews();

  return (
    <Section ariaLabelledby="latest-heading">
      <Container>
        <SectionHeading
          id="latest-heading"
          subtitle="Fresh reporting and analysis from our editorial team."
          title="Latest News"
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 rounded-xl border border-neutral-300 p-4">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
