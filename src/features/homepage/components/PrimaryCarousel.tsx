"use client";

import { useTranslations } from "next-intl";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import type { Article } from "@/shared/types/article.types";
import { useCarouselGestures } from "../hooks/useCarouselGestures";
import { usePrimaryCarousel } from "../hooks/usePrimaryCarousel";

function CarouselControls({ index, count, move }: { index: number; count: number; move: (direction: number) => void }) {
  const t = useTranslations("homepageHighlights");
  const loop = count === 3;
  return <div className="highlight-carousel-controls">
    <button type="button" disabled={!loop && index === 0} onClick={() => move(-1)}>← {t("previous")}</button>
    <div className="highlight-carousel-progress" aria-hidden="true">
      <span style={{ width: `${(index + 1) / count * 100}%` }} />
    </div>
    <span className="highlight-carousel-position" aria-live="polite" aria-atomic="true"
      aria-label={t("position", { current: index + 1, total: count })}>
      {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
    </span>
    <button type="button" disabled={!loop && index === count - 1} onClick={() => move(1)}>{t("next")} →</button>
  </div>;
}

export function PrimaryCarousel({ articles }: { articles: Article[] }) {
  const t = useTranslations("homepageHighlights");
  const { index, move } = usePrimaryCarousel(articles);
  const gestures = useCarouselGestures(move);
  const active = articles[index];
  if (!active) return null;
  const loop = articles.length === 3;
  const previous = articles[index - 1] ?? (loop ? articles.at(-1) : undefined);
  const next = articles[index + 1] ?? (loop ? articles[0] : undefined);
  return <div className="highlight-carousel" role="region" aria-roledescription="carousel" aria-label={t("carouselLabel")}
    tabIndex={articles.length > 1 ? 0 : undefined}
    onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}
    {...gestures}>
    <div className="highlight-carousel-viewport">
      {previous && <div className="highlight-carousel-peek highlight-carousel-previous" aria-hidden="true" inert>
        <ArticleCard article={previous} />
      </div>}
      <div className="highlight-carousel-active" data-active-id={active.id}>
        <ArticleCard article={active} />
      </div>
      {next && <div className="highlight-carousel-peek highlight-carousel-next" aria-hidden="true" inert>
        <ArticleCard article={next} />
      </div>}
    </div>
    {articles.length > 1 && <CarouselControls index={index} count={articles.length} move={move} />}
  </div>;
}
