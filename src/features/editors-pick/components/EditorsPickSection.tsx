"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEditorsPick } from "@/features/homepage/hooks/useEditorsPick";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

function RankedItem({ article, rank }: { article: Article; rank: number }) {
  return (
    <div className="flex gap-4 bg-white p-5">
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
        <h3 className="mt-0.5 font-sans text-lg font-semibold leading-snug text-ink hover:text-accent">
          <Link href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{article.author.fullName}</p>
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
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex gap-4 bg-white p-5">
              <Skeleton className="h-8 w-6" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2">
          {data.items.map((article, index) => (
            <RankedItem key={article.id} article={article} rank={index + 1} />
          ))}
          <GridFillers count={data.items.length} lgCols={2} />
        </div>
      ) : null}
    </FrameModule>
  );
}
