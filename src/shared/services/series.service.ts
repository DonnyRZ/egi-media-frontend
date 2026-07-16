import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapSeriesListDto } from "@/shared/mappers/series.mapper";
import type { ApiSuccessResponse, SeriesListParams } from "@/shared/types/api.types";
import type { SeriesListResult } from "@/shared/types/series.types";

interface SeriesListResponseDto {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    article_count?: number;
    cover_image?: string | null;
  }>;
  meta: { total: number };
}

export async function fetchSeries(
  params: SeriesListParams,
): Promise<SeriesListResult> {
  const response = await axiosClient.get<ApiSuccessResponse<SeriesListResponseDto>>(
    API_ENDPOINTS.series,
    { params },
  );

  return mapSeriesListDto(response.data.data);
}
