"use client";

import Link from "next/link";

import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useEditorsPick } from "@/features/homepage/hooks/useEditorsPick";
import type { Article } from "@/shared/types/article.types";

function RankedItem({ article, rank }: { article: Article; rank: number }) {
  return (
    <article className="group flex gap-4 border-b border-neutral-200 py-4 first:pt-0">
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
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-1 text-xs text-neutral-500">{article.author.fullName}</p>
      </div>
    </article>
  );
}

export function EditorsPickSection() {
  const { data, isLoading, isError, error, refetch } = useEditorsPick();

  return (
    <Section ariaLabelledby="editors-heading">
      <Container>
        <SectionHeading
          id="editors-heading"
          subtitle="The stories our readers are following most closely."
          title="Most Popular"
        />

        {isLoading ? (
          <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex gap-4 py-4">
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

        {!isLoading && !isError && !data?.items.length ? <EmptyState /> : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="grid gap-x-10 md:grid-cols-2">
            {data.items.map((article, index) => (
              <RankedItem key={article.id} article={article} rank={index + 1} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
