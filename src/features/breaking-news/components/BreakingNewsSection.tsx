"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useBreakingNews } from "@/features/homepage/hooks/useBreakingNews";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

function BreakingCard({ article }: { article: Article }) {
  return (
    <article className="group w-60 shrink-0 border-l border-neutral-200 pl-4 first:border-l-0 first:pl-0 sm:w-64">
      <div className="relative aspect-[16/9] overflow-hidden">
        <ArticleImage
          alt={article.title}
          src={article.featuredImage}
        />
      </div>
      {article.category ? (
        <span className="mt-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {article.category.name}
        </span>
      ) : null}
      <h3 className="mt-1 line-clamp-3 font-sans text-lg font-bold leading-snug text-ink group-hover:text-accent">
        <Link href={getArticleHref(article)}>{article.title}</Link>
      </h3>
    </article>
  );
}

export function BreakingNewsSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useBreakingNews();
  const t = useTranslations("breaking");

  if (!isLoading && !isError && !sectionFailed && !data?.items.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="breaking-heading">
      <HomepageSectionNotice section="breaking" />
      <div className="flex flex-col gap-4 bg-white p-4 lg:flex-row lg:items-start lg:gap-6 lg:p-5">
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

          {!isLoading && !isError && data?.items.length ? (
            <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
              {data.items.map((article) => (
                <BreakingCard key={article.id} article={article} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </FrameModule>
  );
}
