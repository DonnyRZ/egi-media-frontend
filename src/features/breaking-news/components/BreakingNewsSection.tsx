"use client";

import Link from "next/link";

import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useBreakingNews } from "@/features/homepage/hooks/useBreakingNews";
import type { Article } from "@/shared/types/article.types";

function BreakingCard({ article }: { article: Article }) {
  return (
    <article className="w-64 shrink-0 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm sm:w-72">
      <div className="relative aspect-[16/10]">
        <ArticleImage alt={article.title} src={article.featuredImage} />
      </div>
      <div className="p-4">
        {article.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            {article.category.name}
          </span>
        ) : null}
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-900 hover:text-primary-700">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
      </div>
    </article>
  );
}

export function BreakingNewsSection() {
  const { data, isLoading, isError, error, refetch } = useBreakingNews();

  return (
    <Section ariaLabelledby="breaking-heading" className="bg-white py-8">
      <Container>
        <div className="mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-2 w-2 rounded-full bg-error"
          />
          <h2
            id="breaking-heading"
            className="text-sm font-bold uppercase tracking-widest text-neutral-900"
          >
            Breaking News
          </h2>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-64 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message="No breaking stories at the moment." />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {data.items.map((article) => (
              <BreakingCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
