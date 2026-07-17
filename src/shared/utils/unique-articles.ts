import type { Article } from "@/shared/types/article.types";

/** Take up to `count` articles not already present in `usedIds`, then mark them used. */
export function takeUniqueArticles(
  articles: Article[],
  count: number,
  usedIds: Set<string>,
): Article[] {
  const picked: Article[] = [];

  for (const article of articles) {
    if (usedIds.has(article.id)) continue;
    usedIds.add(article.id);
    picked.push(article);
    if (picked.length >= count) break;
  }

  return picked;
}
