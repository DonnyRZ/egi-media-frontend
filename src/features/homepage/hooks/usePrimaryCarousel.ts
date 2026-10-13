"use client";

import { useState } from "react";
import type { Article } from "@/shared/types/article.types";

export function usePrimaryCarousel(articles: Article[]) {
  const [activeId, setActiveId] = useState(articles[0]?.id);
  const index = Math.max(0, articles.findIndex(article => article.id === activeId));
  if (articles[index]?.id !== activeId) setActiveId(articles[index]?.id);
  const move = (direction: number) => {
    const next = articles.length === 3
      ? (index + direction + articles.length) % articles.length
      : Math.max(0, Math.min(articles.length - 1, index + direction));
    setActiveId(articles[next]?.id);
  };
  return { index, move };
}
