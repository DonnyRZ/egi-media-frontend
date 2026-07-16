"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { getFeaturedVideos } from "@/shared/repositories/youtube.repository";

export function useFeaturedVideos() {
  return useQuery({
    queryKey: QUERY_KEYS.youtubeVideos.list({ section: "featured" }),
    queryFn: getFeaturedVideos,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}
