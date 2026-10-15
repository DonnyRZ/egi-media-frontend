"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEditorsPick } from "@/features/homepage/hooks/useEditorsPick";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";
import { PUBLIC_ARTICLE_AUTHOR_NAME } from "@/shared/constants/article.constants";

function RankedGrid({ count, children }: { count: number; children: ReactNode }) {
  return (
    <div
      data-popular-grid
      className="grid grid-cols-1 bg-white md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(var(--ranked-rows),minmax(0,auto))]"
      style={{ "--ranked-rows": Math.ceil(count / 2) } as CSSProperties}
    >
      {children}
    </div>
  );
}

function RankedItem({ article, rank, secondColumn }: { article: Article; rank: number; secondColumn: boolean }) {
  return (
    <div data-popular-rank={rank} className={`editorial-gutter flex gap-4 border-b border-neutral-200 bg-white px-4 py-5 md:p-5 ${secondColumn ? "md:border-l" : ""}`}>
      <span
        aria-hidden="true"
        className="font-sans text-3xl font-bold leading-none text-neutral-300"
      >
        {rank}
      </span>
      <div className="min-w-0">
        {article.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {article.category.name}
          </span>
        ) : null}
        <h3 className="editorial-list-title mt-0.5 font-sans text-lg font-semibold leading-snug text-ink hover:text-accent">
          <Link href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{PUBLIC_ARTICLE_AUTHOR_NAME}</p>
      </div>
    </div>
  );
}

export function EditorsPickSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useEditorsPick();
  const t = useTranslations("editors");

  if (!isLoading && !isError && !sectionFailed && !data?.items.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="editors-heading">
      <HomepageSectionNotice section="editors" />
      <FrameHeading
        id="editors-heading"
        title={t("title")}
      />

      {isLoading ? (
        <RankedGrid count={6}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`editorial-gutter flex gap-4 border-b border-neutral-200 bg-white px-4 py-5 md:p-5 ${index >= 3 ? "md:border-l" : ""}`}>
              <Skeleton className="h-8 w-6" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </RankedGrid>
      ) : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <RankedGrid count={data.items.length}>
          {data.items.map((article, index) => (
            <RankedItem key={article.id} article={article} rank={index + 1} secondColumn={index >= Math.ceil(data.items.length / 2)} />
          ))}
        </RankedGrid>
      ) : null}
    </FrameModule>
  );
}
