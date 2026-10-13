import { ArticleCard } from "@/shared/components/common/ArticleCard";
import type { HomepageHighlightsData } from "../types/highlights.types";
import { HighlightPackages } from "./HighlightPackages";
import { PrimaryCarousel } from "./PrimaryCarousel";

export function HighlightsContent({ data }: { data: HomepageHighlightsData }) {
  return <>
    <div className="highlights-desktop">
      <PrimaryCarousel articles={data.primary} />
      {data.supporting.length > 0 && <>
        <div className="highlight-supporting-grid editorial-gutter">
          {data.supporting.slice(0, 8).map(article => <ArticleCard key={article.id} article={article} variant="supporting" />)}
        </div>
      </>}
    </div>
    <HighlightPackages data={data} />
  </>;
}
