"use client";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { HorizontalMediaRow } from "@/shared/components/common/HorizontalMediaRow";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";
import { editorialDate } from "@/shared/utils/editorial-date";
interface TimelineRowProps {
  article: Article;
}
function TimelineDate({ article }: TimelineRowProps) {
  const locale = useLocale();
  if (!article.publishedAt) return null;
  return <time dateTime={article.publishedAt} className="editorial-meta text-xs text-neutral-600">
    {editorialDate(new Date(article.publishedAt), locale, { time: true })}
  </time>;
}
function TimelineRow({ article }: TimelineRowProps) {
  const href = getArticleHref(article);
  return <article className="editorial-timeline-row grid min-w-0 gap-2 py-3 min-[1024px]:grid-cols-[112px_minmax(0,1fr)]">
    <div className="editorial-wide-only"><TimelineDate article={article} /></div>
    <HorizontalMediaRow side="right"
      media={<Link className="absolute inset-0" href={href} aria-label={article.title}>
        <ArticleImage src={article.featuredImage} alt={article.featuredImageAlt || article.title}
          sizes="(max-width: 1023px) 42vw, 152px" />
      </Link>}
      kicker={article.category ? <Link href={`/categories/${article.category.id}`}>{article.category.name}</Link> : undefined}
      title={<h2 className="media-row-heading"><Link className="headline-link" href={href}>{article.title}</Link></h2>}
      description={article.summary}
      metadata={<div className="editorial-mobile-only"><TimelineDate article={article} /></div>}
    />
  </article>;
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
