"use client";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/shared/lib/errors";
import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import {
  fetchMediaCatalog,
  fetchVideoSettings,
  fetchVideoDetail,
} from "@/shared/services/editorial.service";
import type { ContentLocale } from "@/shared/types/article.types";
function useVideoLists(shorts: boolean, page: number, lang: ContentLocale) {
  const videos = useQuery({
    queryKey: ["editorial-videos", shorts, page, lang],
    queryFn: () =>
      fetchYoutubeVideos({
        lang,
        page,
        limit: 12,
        format: shorts ? "short" : "horizontal",
      }),
  });
  const shortVideos = useQuery({
    queryKey: ["editorial-shorts", lang],
    queryFn: () => fetchYoutubeVideos({ lang, limit: 8, format: "short" }),
    enabled: !shorts,
  });
  return { videos, shortVideos };
}
function useVideoCatalogues(shorts: boolean, lang: ContentLocale) {
  const programs = useQuery({
    queryKey: ["video-programs", lang],
    queryFn: () => fetchMediaCatalog("programs", lang),
    enabled: !shorts,
  });
  const collections = useQuery({
    queryKey: ["video-collections", lang],
    queryFn: () => fetchMediaCatalog("collections", lang),
    enabled: !shorts,
  });
  return { programs, collections };
}
function useVideoHero(shorts: boolean, lang: ContentLocale) {
  const settings = useQuery({
    queryKey: ["video-settings"],
    queryFn: fetchVideoSettings,
    enabled: !shorts,
  });
  const configured = useQuery({
    queryKey: ["hero-video", settings.data?.hero_video_id, lang],
    queryFn: () => fetchVideoDetail(settings.data!.hero_video_id!, lang),
    enabled: !shorts && Boolean(settings.data?.hero_video_id),
    retry: false,
  });
  const configuredFailure =
    configured.isError &&
    (!(configured.error instanceof ApiError) ||
      configured.error.statusCode !== 404);
  return { settings, configured, configuredFailure };
}
export function useVideoHub(shorts: boolean) {
  const lang = useLocale() as ContentLocale;
  const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
  const lists = useVideoLists(shorts, page, lang);
  const catalogue = useVideoCatalogues(shorts, lang);
  const configuration = useVideoHero(shorts, lang);
  const hero =
    !shorts && page === 1
      ? configuration.configured.data?.format === "horizontal"
        ? configuration.configured.data
        : lists.videos.data?.items[0]
      : undefined;
  return { lang, page, hero, ...lists, ...catalogue, ...configuration };
}
