import type { ReactNode } from "react";

import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import type { Article } from "@/shared/types/article.types";

interface LatestArticleGridProps {
  articles: Article[];
  renderDesktop?: (article: Article) => ReactNode;
  mobileLimit?: number;
}

function desktopCard(article: Article) {
  return <ArticleCard article={article} className="editorial-gutter bg-white px-4 py-5 md:p-5" />;
}

/** CSS switches presentation without waiting for hydration or refetching news. */
export function LatestArticleGrid({ articles, renderDesktop = desktopCard, mobileLimit }: LatestArticleGridProps) {
  if (!articles.length) return null;
  return <>
    <div className="latest-news-mobile divide-y divide-neutral-200">
      {articles.slice(0, mobileLimit).map((article) => <ArticleCard key={article.id} article={article} variant="horizontal"
        className="editorial-gutter bg-white px-4 py-3" />)}
    </div>
    <div className="latest-news-desktop">
      <AdaptiveCardGrid items={articles} keyForItem={(article) => article.id} renderItem={renderDesktop} />
    </div>
  </>;
}
