import type { ArticleSortKey } from "@/features/cms/components/articles/ArticleFilters";
import type { CmsArticleListItem } from "@/features/cms/types/cms.types";

/**
 * Client-side search + sort over the current page.
 *
 * TODO(backend): `GET /api/v1/articles/me` supports neither a `search` query nor
 * a `sort` param (it always orders by `created_at DESC`). Once those are added,
 * move filtering/sorting server-side for correctness across all pages.
 */
export function filterAndSortArticles(
  items: CmsArticleListItem[],
  search: string,
  sort: ArticleSortKey,
): CmsArticleListItem[] {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.summary ?? "").toLowerCase().includes(query),
      )
    : items;

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "views") return b.viewCount - a.viewCount;
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sort === "oldest" ? aTime - bTime : bTime - aTime;
  });

  return sorted;
}
