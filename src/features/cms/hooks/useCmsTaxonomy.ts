"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchCmsCategories,
  fetchCmsSeries,
  fetchCmsTags,
  fetchCmsTopics,
} from "@/features/cms/services/cms-taxonomy.service";
import { fetchManageArticles } from "@/features/cms/services/cms-article.service";

const STALE = 30_000;

export function useCmsCategories() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy.categories,
    queryFn: fetchCmsCategories,
    staleTime: STALE,
  });
}

export function useCmsTopics() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy.topics,
    queryFn: fetchCmsTopics,
    staleTime: STALE,
  });
}

export function useCmsSeries() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy.series,
    queryFn: fetchCmsSeries,
    staleTime: STALE,
  });
}

export function useCmsTags() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy.tags,
    queryFn: fetchCmsTags,
    staleTime: STALE,
  });
}

export type TaxonomyKind = "category" | "topic" | "series" | "tag";

/** Articles belonging to a given taxonomy item, loaded lazily on expand. */
export function useTaxonomyArticles(
  kind: TaxonomyKind,
  id: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.taxonomy.articles(kind, id),
    queryFn: () =>
      fetchManageArticles({
        page: 1,
        limit: 50,
        categoryId: kind === "category" ? id : undefined,
        topicId: kind === "topic" ? id : undefined,
        seriesId: kind === "series" ? id : undefined,
        tagId: kind === "tag" ? id : undefined,
      }),
    enabled,
    staleTime: STALE,
  });
}
