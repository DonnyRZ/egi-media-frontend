"use client";
import { useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";
interface TimelineRowProps {
  article: Article;
}
function TimelineDate({ article }: TimelineRowProps) {
  const format = useFormatter();
  return (
    <div className="col-span-2 text-xs text-neutral-600 md:col-span-1 md:text-sm">
      {article.publishedAt ? (
        <time dateTime={article.publishedAt}>
          {format.dateTime(new Date(article.publishedAt), {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      ) : null}
    </div>
  );
}
function TimelineHeadline({ article }: TimelineRowProps) {
  return (
    <div className="min-w-0">
      {article.category ? (
        <Link className="kicker" href={`/categories/${article.category.id}`}>
          {article.category.name}
        </Link>
      ) : null}
      <h2 className="mt-1 text-lg font-bold leading-tight tracking-tight md:text-[22px]">
        <Link className="headline-link" href={getArticleHref(article)}>
          {article.title}
        </Link>
      </h2>
      {article.summary ? (
        <p className="mt-2 hidden text-sm leading-6 text-neutral-600 md:line-clamp-3">
          {article.summary}
        </p>
      ) : null}
    </div>
  );
}
function TimelineRow({ article }: TimelineRowProps) {
  return (
    <article className="grid min-w-0 grid-cols-[1fr_96px] gap-4 py-5 md:grid-cols-[112px_minmax(0,1fr)_200px] md:gap-6">
      <TimelineDate article={article} />
      <TimelineHeadline article={article} />
      <Link
        className="relative aspect-video self-start"
        href={getArticleHref(article)}
        aria-label={article.title}
      >
        <ArticleImage
          src={article.featuredImage}
          alt={article.title}
          sizes="200px"
        />
      </Link>
    </article>
  );
}
export function ArticleTimeline({ articles }: { articles: Article[] }) {
  return (
    <div className="divide-y divide-neutral-200">
      {articles.map((article) => (
        <TimelineRow key={article.id} article={article} />
      ))}
    </div>
  );
}
