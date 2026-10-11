import { ArticleImage } from "@/shared/components/common/ArticleImage";
import type { ArticleDetail } from "@/shared/types/article.types";

interface ArticleHeroProps {
  article: ArticleDetail;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden bg-neutral-100">
      <ArticleImage
        alt={article.title}
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        src={article.featuredImage}
      />
    </div>
  );
}
