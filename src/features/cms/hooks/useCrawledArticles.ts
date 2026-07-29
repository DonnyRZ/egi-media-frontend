"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import { fetchCrawledArticles } from "@/features/cms/services/crawled-article.service";
import type { CrawledArticlesParams } from "@/features/cms/types/news-feed.types";

export function useCrawledArticles(
  params: CrawledArticlesParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.newsFeed.list(params),
    queryFn: () => fetchCrawledArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
}
