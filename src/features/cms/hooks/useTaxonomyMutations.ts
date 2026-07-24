"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  createCategory,
  createSeries,
  createTag,
  createTopic,
  deleteCategory,
  deleteSeries,
  deleteTag,
  deleteTopic,
  updateCategory,
  updateSeries,
  updateTag,
  updateTopic,
  type SeriesWritePayload,
  type TaxonomyWritePayload,
  type TopicWritePayload,
} from "@/features/cms/services/cms-taxonomy.service";

interface WriteArgs<T> {
  id?: string;
  payload: T;
}

function useResourceMutations<T>(
  queryKeys: QueryKey[],
  handlers: {
    create: (payload: T) => Promise<unknown>;
    update?: (id: string, payload: T) => Promise<unknown>;
    remove: (id: string) => Promise<unknown>;
  },
) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryKeys.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );

  const save = useMutation({
    mutationFn: ({ id, payload }: WriteArgs<T>) =>
      id && handlers.update
        ? handlers.update(id, payload)
        : handlers.create(payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => handlers.remove(id),
    onSuccess: invalidate,
  });

  return { save, remove };
}

export function useCategoryMutations() {
  return useResourceMutations<TaxonomyWritePayload>(
    [CMS_QUERY_KEYS.categories.all, CMS_QUERY_KEYS.taxonomy.categories],
    { create: createCategory, update: updateCategory, remove: deleteCategory },
  );
}

export function useTopicMutations() {
  return useResourceMutations<TopicWritePayload>(
    [CMS_QUERY_KEYS.topics.all, CMS_QUERY_KEYS.taxonomy.topics],
    { create: createTopic, update: updateTopic, remove: deleteTopic },
  );
}

export function useSeriesMutations() {
  return useResourceMutations<SeriesWritePayload>(
    [CMS_QUERY_KEYS.series.all, CMS_QUERY_KEYS.taxonomy.series],
    { create: createSeries, update: updateSeries, remove: deleteSeries },
  );
}

export function useTagMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    [CMS_QUERY_KEYS.tags.all, CMS_QUERY_KEYS.taxonomy.tags].forEach(
      (queryKey) => queryClient.invalidateQueries({ queryKey }),
    );

  const save = useMutation({
    mutationFn: ({ id, name }: { id?: string; name: string }) =>
      id ? updateTag(id, name) : createTag(name),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: invalidate,
  });

  return { save, remove };
}
