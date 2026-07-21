"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import { fetchTags } from "@/features/cms/services/cms-taxonomy.service";
import { fetchCategories } from "@/shared/services/category.service";
import { fetchSeries } from "@/shared/services/series.service";
import { fetchTopics } from "@/shared/services/topic.service";

const OPTION_STALE_TIME = 60_000;

export function useCategoryOptions() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.categories.all,
    queryFn: () => fetchCategories({ page: 1, limit: 100 }),
    staleTime: OPTION_STALE_TIME,
  });
}

export function useTopicOptions() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.topics.all,
    queryFn: () => fetchTopics({ page: 1, limit: 100 }),
    staleTime: OPTION_STALE_TIME,
  });
}

export function useSeriesOptions() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.series.all,
    queryFn: () => fetchSeries({ page: 1, limit: 100 }),
    staleTime: OPTION_STALE_TIME,
  });
}

export function useTagOptions() {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.tags.all,
    queryFn: fetchTags,
    staleTime: OPTION_STALE_TIME,
  });
}
