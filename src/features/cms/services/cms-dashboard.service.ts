import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { DashboardStats } from "@/features/cms/types/cms.types";

interface ArticleStatsDto {
  total: number;
  draft: number;
  review: number;
  scheduled: number;
  published: number;
  archived: number;
}

/**
 * Dashboard status counts from `GET /api/v1/articles/stats`.
 * Superadmin → newsroom-wide; author → own articles only (enforced by backend).
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await axiosClient.get<ApiSuccessResponse<ArticleStatsDto>>(
    API_ENDPOINTS.articlesStats,
  );
  const data = response.data.data;
  return {
    total: data.total ?? 0,
    draft: data.draft ?? 0,
    review: data.review ?? 0,
    scheduled: data.scheduled ?? 0,
    published: data.published ?? 0,
    archived: data.archived ?? 0,
  };
}
