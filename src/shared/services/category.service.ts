import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapCategoryListDto } from "@/shared/mappers/category.mapper";
import type {
  PaginatedApiResponse,
  TaxonomyListParams,
} from "@/shared/types/api.types";
import type { CategoryListResult } from "@/shared/types/category.types";

interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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
