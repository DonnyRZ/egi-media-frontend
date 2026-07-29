import axios from "axios";

import { mapCrawledArticle, type CrawledArticleDto } from "@/features/cms/mappers/news-feed.mapper";
import { env } from "@/shared/config/env";
import { API_TIMEOUT_MS } from "@/shared/constants/api.constants";
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

const crawlClient = axios.create({
  baseURL: env.crawlApiUrl,
  timeout: API_TIMEOUT_MS,
  headers: { Accept: "application/json" },
});

export async function fetchCrawledArticles(
  params: CrawledArticlesParams,
): Promise<CrawledArticlesResult> {
  const response = await crawlClient.get<CrawledArticlesApiResponse>(
    "/api/crawled-articles",
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
