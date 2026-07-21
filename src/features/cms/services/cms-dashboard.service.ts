import { fetchMyArticles } from "@/features/cms/services/cms-article.service";
import { ARTICLE_STATUSES } from "@/features/cms/constants/cms.constants";
import type { DashboardStats } from "@/features/cms/types/cms.types";

/**
 * Aggregates status counts from the author's own articles.
 *
 * TODO(backend): There is no dashboard statistics endpoint. This derives counts
 * from `/api/v1/articles/me` (one lightweight request per status). A dedicated
 * `GET /api/v1/articles/stats` would remove the fan-out and enable org-wide
 * counts for superadmin.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [total, ...byStatus] = await Promise.all([
    fetchMyArticles({ page: 1, limit: 1 }),
    ...ARTICLE_STATUSES.map((status) =>
      fetchMyArticles({ page: 1, limit: 1, status }),
    ),
  ]);

  const counts = ARTICLE_STATUSES.reduce<Record<string, number>>(
    (acc, status, index) => {
      acc[status] = byStatus[index].total;
      return acc;
    },
    {},
  );

  return {
    total: total.total,
    draft: counts.draft ?? 0,
    review: counts.review ?? 0,
    scheduled: counts.scheduled ?? 0,
    published: counts.published ?? 0,
    archived: counts.archived ?? 0,
  };
}
