"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  changeArticleStatus,
  createArticle,
  deleteArticle,
  updateArticle,
  updateArticlePlacements,
} from "@/features/cms/services/cms-article.service";
import type {
  ArticlePlacement,
  ArticleStatus,
  ArticleWritePayload,
} from "@/features/cms/types/cms.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useArticleMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: CMS_QUERY_KEYS.articles.all,
    });
    void queryClient.invalidateQueries({
      queryKey: CMS_QUERY_KEYS.dashboard.all,
    });
    void queryClient.invalidateQueries({
      queryKey: CMS_QUERY_KEYS.auditLogs.all,
    });
    void queryClient.invalidateQueries({
      queryKey: CMS_QUERY_KEYS.translationJobs.all,
    });
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.homepage.all,
    });
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.articles.all,
    });
  };

  const create = useMutation({
    mutationFn: (payload: ArticleWritePayload) => createArticle(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ArticleWritePayload }) =>
      updateArticle(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: invalidate,
  });

  const changeStatus = useMutation({
    mutationFn: ({
      id,
      status,
      publishedAt,
    }: {
      id: string;
      status: ArticleStatus;
      publishedAt?: string | null;
    }) => changeArticleStatus(id, status, publishedAt),
    onSuccess: invalidate,
  });

  const updatePlacements = useMutation({
    mutationFn: ({
      id,
      placements,
      headlinePosition,
    }: {
      id: string;
      placements: ArticlePlacement[];
      headlinePosition?: number | null;
    }) => updateArticlePlacements(id, placements, headlinePosition),
    onSuccess: invalidate,
  });

  return { create, update, remove, changeStatus, updatePlacements };
}
