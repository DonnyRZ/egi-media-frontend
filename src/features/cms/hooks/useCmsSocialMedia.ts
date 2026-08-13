"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  createCmsSocialMediaLink,
  deleteCmsSocialMediaLink,
  fetchCmsSocialMediaLinks,
  updateCmsSocialMediaLink,
  type CmsSocialMediaLinkWritePayload,
  type CmsSocialMediaLinksParams,
} from "@/features/cms/services/cms-social-media.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useCmsSocialMediaLinks(params: CmsSocialMediaLinksParams) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.socialMediaLinks.list(params),
    queryFn: () => fetchCmsSocialMediaLinks(params),
    placeholderData: keepPreviousData,
  });
}

export function useSocialMediaLinkMutations() {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: CMS_QUERY_KEYS.socialMediaLinks.all,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.socialMediaLinks.all,
      }),
    ]);
  };

  const save = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: CmsSocialMediaLinkWritePayload;
    }) =>
      id
        ? updateCmsSocialMediaLink(id, payload)
        : createCmsSocialMediaLink(payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteCmsSocialMediaLink(id),
    onSuccess: invalidate,
  });

  return { save, remove };
}
