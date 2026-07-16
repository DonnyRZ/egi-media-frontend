import { fetchYoutubeVideos } from "@/shared/services/youtube.service";
import type { YoutubeVideoListParams } from "@/shared/types/api.types";
import type { YoutubeVideoListResult } from "@/shared/types/youtube.types";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";

export async function getFeaturedVideos(): Promise<YoutubeVideoListResult> {
  const params: YoutubeVideoListParams = {
    page: 1,
    limit: HOMEPAGE_LIMITS.featuredVideos,
  };

  return fetchYoutubeVideos(params);
}
