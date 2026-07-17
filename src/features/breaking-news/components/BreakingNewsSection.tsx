"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
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
    <article className="group w-60 shrink-0 border-l border-neutral-200 pl-4 sm:w-64">
      <div className="relative aspect-[16/9] overflow-hidden">
        <ArticleImage
          alt={article.title}
          className="transition-transform duration-500 group-hover:scale-105"
          src={article.featuredImage}
        />
      </div>
      {article.category ? (
        <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {article.category.name}
        </span>
      ) : null}
      <h3 className="mt-1 line-clamp-3 font-serif text-base font-semibold leading-snug text-ink group-hover:text-accent">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
    </article>
  );
}

export function BreakingNewsSection() {
  const { data, isLoading, isError, error, refetch } = useBreakingNews();
  const t = useTranslations("breaking");

  return (
    <Section ariaLabelledby="breaking-heading" className="border-y border-ink py-5">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <div className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-accent"
            />
            <h2
              id="breaking-heading"
              className="text-sm font-bold uppercase tracking-[0.14em] text-accent"
            >
              {t("title")}
            </h2>
          </div>

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-44 w-60 shrink-0" />
                ))}
              </div>
            ) : null}

            {isError ? (
              <ErrorState message={error?.message} onRetry={() => void refetch()} />
            ) : null}

            {!isLoading && !isError && !data?.items.length ? (
              <EmptyState message={t("empty")} />
            ) : null}

            {!isLoading && !isError && data?.items.length ? (
              <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
                {data.items.map((article) => (
                  <BreakingCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
