"use client";

import { useTranslations } from "next-intl";

import { useTopicNews } from "@/features/homepage/hooks/useTopicNews";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { TopicNewsGroup } from "@/shared/types/topic.types";

function TopicBlock({ group }: { group: TopicNewsGroup }) {
  const [featured, ...rest] = group.articles;

  if (!featured) return null;

  return (
    <div className="min-w-0 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0 lg:border-t-0 lg:border-l lg:border-neutral-200 lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-accent" />
          <h3 className="font-serif text-xl font-bold text-ink">{group.topic.name}</h3>
        </div>
        {group.topic.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {group.topic.description}
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        <ArticleCard article={featured} variant="horizontal" />
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}

export function TopicNewsSection() {
  const { data, isLoading, isError, error, refetch } = useTopicNews();
  const t = useTranslations("topics");

  if (!isLoading && !isError && !data?.length) {
    return null;
  }

  return (
    <Section ariaLabelledby="topics-heading">
      <Container>
        <SectionHeading
          id="topics-heading"
          subtitle={t("subtitle")}
          title={t("title")}
        />

        {isLoading ? (
          <div className="grid gap-10 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-0">
            {data.map((group) => (
              <TopicBlock key={group.topic.id} group={group} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
