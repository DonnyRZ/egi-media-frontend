import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapSeriesDto, mapSeriesListDto } from "@/shared/mappers/series.mapper";
import {
  mapArticleDto,
  type ArticleListItemDto,
} from "@/shared/mappers/article.mapper";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
  SeriesListParams,
} from "@/shared/types/api.types";
import type { SeriesDetail, SeriesListResult } from "@/shared/types/series.types";

interface SeriesDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null;
  article_count?: number;
  cover_image?: string | null;
  created_at?: string | null;
}

interface SeriesDetailDto extends SeriesDto {
  articles?: ArticleListItemDto[];
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
    meta: {
      total: response.data.meta?.total ?? 0,
      page: response.data.meta?.page,
      limit: response.data.meta?.limit,
      total_pages: response.data.meta?.total_pages,
    },
  });
}

export async function fetchSeriesById(
  id: string,
  lang: SeriesListParams["lang"] = "id",
): Promise<SeriesDetail> {
  const response = await axiosClient.get<ApiSuccessResponse<SeriesDetailDto>>(
    API_ENDPOINTS.seriesById(id),
    { params: { lang } },
  );

  const dto = response.data.data;
  const series = mapSeriesDto(dto);
  const articles = (dto.articles ?? []).map(mapArticleDto);

  return {
    ...series,
    articleCount: articles.length || series.articleCount,
    articles,
  };
}
