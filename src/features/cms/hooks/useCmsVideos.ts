"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  createCmsVideo,
  deleteCmsVideo,
  fetchCmsVideos,
  updateCmsVideo,
  type CmsVideoWritePayload,
  type CmsVideosParams,
} from "@/features/cms/services/cms-video.service";

export function useCmsVideos(params: CmsVideosParams) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.videos.list(params),
    queryFn: () => fetchCmsVideos(params),
    placeholderData: keepPreviousData,
  });
}

export function useVideoMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries();

  const save = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: CmsVideoWritePayload;
    }) => (id ? updateCmsVideo(id, payload) : createCmsVideo(payload)),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteCmsVideo(id),
    onSuccess: invalidate,
  });

  return { save, remove };
}
