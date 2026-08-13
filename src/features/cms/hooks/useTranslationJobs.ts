"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchTranslationJobs,
  retryTranslationJob,
} from "@/features/cms/services/cms-translation-jobs.service";
import type {
  TranslationEntityType,
  TranslationJob,
} from "@/features/cms/types/cms.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

const ACTIVE_STATUSES = new Set(["queued", "processing"]);

export function useTranslationJobs() {
  const query = useQuery({
    queryKey: CMS_QUERY_KEYS.translationJobs.list(),
    queryFn: () => fetchTranslationJobs(30),
    staleTime: 2_000,
    refetchInterval: (q) => {
      const jobs = q.state.data as TranslationJob[] | undefined;
      const hasActive = jobs?.some((j) => ACTIVE_STATUSES.has(j.jobStatus));
      return hasActive ? 2_000 : 20_000;
    },
    refetchOnWindowFocus: true,
  });

  const jobs = query.data ?? [];
  const activeCount = jobs.filter((j) => ACTIVE_STATUSES.has(j.jobStatus)).length;
  const failedCount = jobs.filter((j) => j.jobStatus === "failed").length;

  return {
    jobs,
    activeCount,
    failedCount,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useRetryTranslation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
    }: {
      entityType: TranslationEntityType;
      entityId: string;
    }) => retryTranslationJob(entityType, entityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CMS_QUERY_KEYS.translationJobs.all,
      });
      void queryClient.invalidateQueries({
        queryKey: CMS_QUERY_KEYS.articles.all,
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.columns.all,
      });
    },
  });
}
