"use client";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ContentMetadata } from "@/shared/components/common/ContentMetadata";
import { HorizontalMediaRow } from "@/shared/components/common/HorizontalMediaRow";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";
import { cn } from "@/shared/lib/cn";
import { PUBLIC_ARTICLE_AUTHOR_NAME } from "@/shared/constants/article.constants";

export function HorizontalArticleCard({ article, className }: { article: Article; className?: string }) {
  const href = getArticleHref(article);
  return <article className={cn("editorial-card group min-w-0", className)}>
    <HorizontalMediaRow
      media={<Link href={href} aria-label={article.title} className="absolute inset-0">
        <ArticleImage src={article.featuredImage} alt={article.featuredImageAlt || article.title}
          sizes="(max-width: 1023px) 42vw, 152px" />
      </Link>}
      kicker={article.category?.name}
      title={<h3 className="media-row-heading"><Link className="headline-link" href={href}>{article.title}</Link></h3>}
      metadata={<ContentMetadata author={PUBLIC_ARTICLE_AUTHOR_NAME} publishedAt={article.publishedAt}
        readingTimeMinutes={article.readingTimeMinutes} compact />}
    />
  </article>;
}
