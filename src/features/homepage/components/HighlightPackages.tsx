import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { HorizontalArticleCard } from "@/shared/components/common/HorizontalArticleCard";
import { buildHighlightPackages } from "../utils/highlight-packages";
import type { HomepageHighlightsData } from "../types/highlights.types";

export function HighlightPackages({ data }: { data: HomepageHighlightsData }) {
  const { packages, remaining } = buildHighlightPackages(data);
  return <div className="highlights-mobile editorial-gutter">
    {packages.map(pack => <div className="highlight-package" key={pack.primary.id}>
      <ArticleCard article={pack.primary} className="highlight-primary-card" />
      <div className="highlight-supporting-list">
        {pack.supporting.map(article => <HorizontalArticleCard key={article.id} article={article} />)}
      </div>
    </div>)}
    {remaining.length > 0 && <div className="highlight-supporting-list">
      {remaining.map(article => <HorizontalArticleCard key={article.id} article={article} />)}
    </div>}
  </div>;
}
