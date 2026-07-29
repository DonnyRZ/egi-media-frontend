import { Badge } from "@/features/cms/components/ui/Badge";
import type { CrawledArticle } from "@/features/cms/types/news-feed.types";
import { formatAbsoluteDateTime } from "@/shared/utils/format";

interface CrawledArticleCardProps {
  article: CrawledArticle;
}

export function CrawledArticleCard({ article }: CrawledArticleCardProps) {
  const href = article.sourceUrl;
  const dateLabel =
    formatAbsoluteDateTime(article.publishedAt) ||
    formatAbsoluteDateTime(article.collectedAt) ||
    "—";

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {article.featuredImage ? (
          // External crawl thumbnails — plain img avoids next/image remote allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.featuredImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">{article.sourceLabel}</Badge>
          {article.category ? (
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {article.category}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 group-hover:text-accent dark:text-neutral-100">
          {article.title}
        </h3>
        {article.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {article.summary}
          </p>
        ) : article.content ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {article.content}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          {article.authorName ? (
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {article.authorName}
            </span>
          ) : null}
          {article.authorName ? <span aria-hidden="true">•</span> : null}
          <time dateTime={article.publishedAt ?? article.collectedAt ?? undefined}>
            {dateLabel}
          </time>
        </div>
      </div>
    </>
  );

  if (!href) {
    return <article className="group flex h-full flex-col">{body}</article>;
  }

  return (
    <article className="group flex h-full flex-col">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {body}
      </a>
    </article>
  );
}
