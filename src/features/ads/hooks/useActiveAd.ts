"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdPlacement } from "@/shared/types/ads.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { getActiveAdsByPlacement } from "@/shared/repositories/ads.repository";

export function useActiveAd(placement: AdPlacement) {
  return useQuery({
    queryKey: QUERY_KEYS.ads.byPlacement(placement),
    queryFn: async () => {
      const ads = await getActiveAdsByPlacement(placement);
      return ads[0] ?? null;
    },
    staleTime: 60_000,
  });
}
