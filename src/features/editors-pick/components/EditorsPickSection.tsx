"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEditorsPick } from "@/features/homepage/hooks/useEditorsPick";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

function RankedItem({ article, rank }: { article: Article; rank: number }) {
  return (
    <article className="group flex gap-4 p-5">
      <span
        aria-hidden="true"
        className="font-serif text-3xl font-bold leading-none text-neutral-300"
      >
        {rank}
      </span>
      <div className="min-w-0">
        {article.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {article.category.name}
          </span>
        ) : null}
        <h3 className="mt-0.5 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-accent">
          <Link href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{article.author.fullName}</p>
      </div>
    </article>
  );
}

export function EditorsPickSection() {
  const { data, isLoading, isError, error, refetch } = useEditorsPick();
  const t = useTranslations("editors");

  if (!isLoading && !isError && !data?.items.length) {
    return null;
  }

  return (
    <Section ariaLabelledby="editors-heading" dense>
      <Container>
        <SectionHeading
          id="editors-heading"
          subtitle={t("subtitle")}
          title={t("title")}
        />

        {isLoading ? (
          <div className="grid border border-neutral-200 divide-y divide-neutral-200 md:grid-cols-2 md:divide-x">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-4 p-5">
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
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="grid border border-neutral-200 divide-y divide-neutral-200 md:grid-cols-2 md:divide-x">
            {data.items.map((article, index) => (
              <RankedItem key={article.id} article={article} rank={index + 1} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
