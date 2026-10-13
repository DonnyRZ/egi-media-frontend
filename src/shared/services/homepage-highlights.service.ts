import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import { mapArticleDto, type ArticleListItemDto } from "@/shared/mappers/article.mapper";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { HomepageHighlightsData } from "@/features/homepage/types/highlights.types";

interface HighlightsDto { primary: ArticleListItemDto[]; supporting: ArticleListItemDto[] }

export async function fetchHomepageHighlights(lang: ContentLocale): Promise<HomepageHighlightsData> {
  const response = await axiosClient.get<ApiSuccessResponse<HighlightsDto>>(
    API_ENDPOINTS.homepageHighlights, { params: { lang } },
  );
  const data = response.data.data;
  if (!Array.isArray(data?.primary) || !Array.isArray(data?.supporting)) {
    throw new Error("Invalid homepage highlights response");
  }
  return { primary: data.primary.map(mapArticleDto), supporting: data.supporting.map(mapArticleDto) };
}
