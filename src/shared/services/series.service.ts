import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapSeriesListDto } from "@/shared/mappers/series.mapper";
import type {
  PaginatedApiResponse,
  SeriesListParams,
} from "@/shared/types/api.types";
import type { SeriesListResult } from "@/shared/types/series.types";

interface SeriesDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  article_count?: number;
  cover_image?: string | null;
}

export async function fetchSeries(
  params: SeriesListParams,
): Promise<SeriesListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<SeriesDto>>(
    API_ENDPOINTS.series,
    { params },
  );

  return mapSeriesListDto({
    items: response.data.data,
    meta: { total: response.data.meta?.total ?? 0 },
  });
}
