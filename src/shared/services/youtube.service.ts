import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapYoutubeVideoListDto } from "@/shared/mappers/youtube.mapper";
import type {
  PaginatedApiResponse,
  YoutubeVideoListParams,
} from "@/shared/types/api.types";
import type { YoutubeVideoListResult } from "@/shared/types/youtube.types";

interface YoutubeVideoDto {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration?: string | null;
  created_at?: string | null;
}

export async function fetchYoutubeVideos(
  params: YoutubeVideoListParams,
): Promise<YoutubeVideoListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<YoutubeVideoDto>>(
    API_ENDPOINTS.youtubeVideos,
    { params },
  );

  return mapYoutubeVideoListDto({
    items: response.data?.data ?? [],
    meta: {
      total: response.data?.meta?.total ?? 0,
      page: response.data?.meta?.page,
      limit: response.data?.meta?.limit,
      total_pages: response.data?.meta?.total_pages,
    },
  });
}
