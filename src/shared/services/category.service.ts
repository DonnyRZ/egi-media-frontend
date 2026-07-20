import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import {
  mapCategoryDetailDto,
  mapCategoryListDto,
} from "@/shared/mappers/category.mapper";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
  TaxonomyListParams,
} from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type {
  CategoryDetail,
  CategoryListResult,
} from "@/shared/types/category.types";

interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
  translations?: Partial<
    Record<
      ContentLocale,
      { name: string; slug: string | null; description: string | null }
    >
  >;
}

export async function fetchCategories(
  params: TaxonomyListParams,
): Promise<CategoryListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<CategoryDto>>(
    API_ENDPOINTS.categories,
    { params },
  );

  return mapCategoryListDto({
    items: response.data.data,
    meta: { total: response.data.meta?.total ?? 0 },
  });
}

export async function fetchCategoryBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<CategoryDetail | null> {
  try {
    const response = await axiosClient.get<ApiSuccessResponse<CategoryDto>>(
      API_ENDPOINTS.categoryById(slug),
      { params: { lang } },
    );
    return mapCategoryDetailDto(response.data.data);
  } catch {
    return null;
  }
}
