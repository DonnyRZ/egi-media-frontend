"use client";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMediaResource,
  fetchVideoDetail,
} from "@/shared/services/editorial.service";
import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import type { ContentLocale } from "@/shared/types/article.types";
export function useVideoDetail(id: string) {
  const lang = useLocale() as ContentLocale;
  const video = useQuery({
    queryKey: ["video-detail", id, lang],
    queryFn: () => fetchVideoDetail(id, lang),
  });
  const program = useQuery({
    queryKey: ["video-program-link", video.data?.programId, lang],
    queryFn: () => fetchMediaResource("programs", video.data!.programId!, lang),
    enabled: Boolean(video.data?.programId),
    retry: false,
  });
  const related = useQuery({
    queryKey: ["video-related", id, lang, video.data?.format],
    queryFn: () =>
      fetchYoutubeVideos({
        lang,
        format: video.data?.format || "horizontal",
        limit: 12,
      }),
    enabled: Boolean(video.data),
  });
  return { video, program, related };
}
