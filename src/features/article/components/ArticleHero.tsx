import { ArticleImage } from "@/shared/components/common/ArticleImage";
import type { ArticleDetail } from "@/shared/types/article.types";

interface ArticleHeroProps {
  article: ArticleDetail;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <figure><div className="relative mx-auto aspect-[16/9] w-full overflow-hidden bg-neutral-100">
      <ArticleImage
        alt={article.featuredImageAlt||article.title}
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        src={article.featuredImage}
      />
    </div>{article.featuredImageCaption||article.featuredImageCredit?<figcaption className="mt-2 text-xs leading-5 text-neutral-600">{article.featuredImageCaption} {article.featuredImageCredit?<span>{article.featuredImageCredit}</span>:null}</figcaption>:null}</figure>
  );
}
