import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { GridFillers } from "@/shared/components/common/GridFillers";
import type { Article } from "@/shared/types/article.types";

/** Keep the same card width and left alignment as the surrounding news grid. */
export function TrendingArticleGrid({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  if (articles.length === 1) return <div className="homepage-trending-grid homepage-trending-single">
    <ArticleCard article={articles[0]}
      className="homepage-trending-card editorial-gutter bg-white px-4 py-5 md:p-5" />
  </div>;

  return <div className="homepage-trending-grid grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
    {articles.map((article) => <ArticleCard key={article.id} article={article}
      className="homepage-trending-card editorial-gutter bg-white px-4 py-5 md:p-5" />)}
    <GridFillers count={articles.length} />
  </div>;
}
