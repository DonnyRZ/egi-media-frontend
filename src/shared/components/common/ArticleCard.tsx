import Link from "next/link";

import { ArticleImage } from "@/shared/components/common/ArticleImage";
import type { Article } from "@/shared/types/article.types";
import { formatPublishedDate } from "@/shared/utils/format";
import { cn } from "@/shared/lib/cn";

interface ArticleMetaProps {
  article: Article;
  className?: string;
}

export function ArticleMeta({ article, className }: ArticleMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-sm text-neutral-500", className)}>
      <span>{article.author.fullName}</span>
      <span aria-hidden="true">•</span>
      <time dateTime={article.publishedAt ?? undefined}>
        {formatPublishedDate(article.publishedAt)}
      </time>
      <span aria-hidden="true">•</span>
      <span>{article.readingTimeMinutes} min read</span>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <ArticleImage alt={article.title} src={article.featuredImage} />
        </div>
        <div className="min-w-0 flex-1">
          {article.category ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
              {article.category.name}
            </span>
          ) : null}
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-primary-700">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
          <ArticleMeta article={article} className="mt-2" />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
        {article.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            {article.category.name}
          </span>
        ) : null}
        <h3 className="mt-1 text-base font-semibold text-neutral-900 group-hover:text-primary-700">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <ArticleMeta article={article} className="mt-2" />
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ArticleImage alt={article.title} src={article.featuredImage} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            {article.category.name}
          </span>
        ) : null}
        <h3 className="mt-2 text-xl font-semibold text-neutral-900 group-hover:text-primary-700">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.summary ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-neutral-700">
            {article.summary}
          </p>
        ) : null}
        <ArticleMeta article={article} className="mt-4" />
      </div>
    </article>
  );
}
