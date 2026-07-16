"use client";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEditorsPick } from "@/features/homepage/hooks/useEditorsPick";

export function EditorsPickSection() {
  const { data, isLoading, isError, error, refetch } = useEditorsPick();

  return (
    <Section ariaLabelledby="editors-heading">
      <Container>
        <SectionHeading
          id="editors-heading"
          subtitle="Handpicked stories from our editorial desk."
          title="Editors' Picks"
        />

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-20 w-28 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
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
          <div className="space-y-6 rounded-xl border border-neutral-300 bg-white p-6 shadow-sm">
            {data.items.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
