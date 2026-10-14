import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import { VIDEOS_PAGE_LIMIT } from "@/shared/constants/videos.constants";
import type { YoutubeVideoListParams } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { YoutubeVideoListResult } from "@/shared/types/youtube.types";

export async function getFeaturedVideos(
  lang: ContentLocale = "id",
): Promise<YoutubeVideoListResult> {
  return fetchYoutubeVideos({
    page: 1,
    // One result is also used as the single Video Pilihan in the homepage hero.
    // Fetch one extra so Video Terbaru can still show its full six items after
    // that exact hero video is removed from the lower list.
    limit: HOMEPAGE_LIMITS.latestVideos + 1,
    format: "horizontal",
    lang,
  });
}

export async function getVideosPage(
  lang: ContentLocale = "id",
  page = 1,
): Promise<YoutubeVideoListResult> {
  const params: YoutubeVideoListParams = {
    page,
    limit: VIDEOS_PAGE_LIMIT,
    lang,
  };

  return fetchYoutubeVideos(params);
}
