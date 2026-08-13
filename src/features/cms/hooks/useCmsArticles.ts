"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchCmsArticleById,
  fetchManageArticles,
} from "@/features/cms/services/cms-article.service";
import type { CmsMyArticlesParams } from "@/features/cms/types/cms.types";

export function useCmsArticles(
  params: CmsMyArticlesParams & { search?: string },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.articles.list(params),
    queryFn: () => fetchManageArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
}

export function useCmsArticle(id: string | null) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.articles.detail(id ?? ""),
    queryFn: () => fetchCmsArticleById(id as string),
    enabled: Boolean(id),
  });
}
