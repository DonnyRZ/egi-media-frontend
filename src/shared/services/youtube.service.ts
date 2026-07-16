import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapYoutubeVideoListDto } from "@/shared/mappers/youtube.mapper";
import type { ApiSuccessResponse, YoutubeVideoListParams } from "@/shared/types/api.types";
import type { YoutubeVideoListResult } from "@/shared/types/youtube.types";

interface YoutubeVideoListResponseDto {
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    duration?: string | null;
  }>;
  meta: { total: number };
}

export async function fetchYoutubeVideos(
  params: YoutubeVideoListParams,
): Promise<YoutubeVideoListResult> {
  const response = await axiosClient.get<ApiSuccessResponse<YoutubeVideoListResponseDto>>(
    API_ENDPOINTS.youtubeVideos,
    { params },
  );

  return mapYoutubeVideoListDto(response.data.data);
}
