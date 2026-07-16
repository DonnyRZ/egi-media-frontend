import Link from "next/link";

import { ArticleImage } from "@/shared/components/common/ArticleImage";
import type { Article } from "@/shared/types/article.types";
import { formatPublishedDate } from "@/shared/utils/format";

interface HeroFeaturedCardProps {
  article: Article;
}

export function HeroFeaturedCard({ article }: HeroFeaturedCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-primary-900">
      <div className="relative aspect-[16/9] lg:aspect-[16/10]">
        <ArticleImage
          alt={article.title}
          className="opacity-80 transition-opacity group-hover:opacity-90"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          src={article.featuredImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/40 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        {article.category ? (
          <span className="inline-block rounded-full bg-primary-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {article.category.name}
          </span>
        ) : null}
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        {article.summary ? (
          <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-primary-100 sm:text-base">
            {article.summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-primary-100">
          <span>{article.author.fullName}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={article.publishedAt ?? undefined}>
            {formatPublishedDate(article.publishedAt)}
          </time>
          <span aria-hidden="true">•</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>
      </div>
    </article>
  );
}
