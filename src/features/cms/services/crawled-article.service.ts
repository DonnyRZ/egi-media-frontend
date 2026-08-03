import { mapCrawledArticle, type CrawledArticleDto } from "@/features/cms/mappers/news-feed.mapper";
import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import type {
  CrawledArticlesParams,
  CrawledArticlesResult,
} from "@/features/cms/types/news-feed.types";

interface CrawledArticlesApiData {
  items: CrawledArticleDto[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface CrawledArticlesApiResponse {
  success: boolean;
  data: CrawledArticlesApiData;
  error?: { message?: string };
}

export async function fetchCrawledArticles(
  params: CrawledArticlesParams,
): Promise<CrawledArticlesResult> {
  const response = await axiosClient.get<CrawledArticlesApiResponse>(
    API_ENDPOINTS.newsFeedArticles,
    {
      params: {
        page: params.page,
        limit: params.limit,
        source: params.source || undefined,
        search: params.search || undefined,
      },
    },
  );

  if (!response.data.success) {
    throw new Error(response.data.error?.message ?? "Failed to load crawled articles");
  }

  const data = response.data.data;
  return {
    items: (data.items ?? []).map(mapCrawledArticle),
    page: data.page,
    limit: data.limit,
    total: data.total,
    totalPages: data.total_pages,
  };
}
