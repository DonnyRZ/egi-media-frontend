"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchCmsAds,
  updateCmsAd,
  type CmsAdWritePayload,
  type CmsAdsParams,
} from "@/features/cms/services/cms-ads.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useCmsAds(params: CmsAdsParams) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.ads.list(params),
    queryFn: () => fetchCmsAds(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdMutations() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.ads.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ads.all }),
    ]);
  };

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CmsAdWritePayload;
    }) => updateCmsAd(id, payload),
    onSuccess: invalidate,
  });

  return { update };
}
