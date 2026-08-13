"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import { getActiveSocialMediaLinks } from "@/shared/repositories/social-media.repository";

export function useSocialMediaLinks() {
  return useQuery({
    queryKey: QUERY_KEYS.socialMediaLinks.active(),
    queryFn: getActiveSocialMediaLinks,
    staleTime: 5 * 60 * 1000,
  });
}
