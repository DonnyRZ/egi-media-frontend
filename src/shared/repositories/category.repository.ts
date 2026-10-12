import {
  fetchCategories,
  fetchCategoryBySlug,
} from "@/shared/services/category.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type {
  CategoryDetail,
  CategoryListResult,
} from "@/shared/types/category.types";

export async function getCategories(
  params: TaxonomyListParams,
): Promise<CategoryListResult> {
  return fetchCategories(params);
}

export async function getCategoryBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<CategoryDetail | null> {
  return fetchCategoryBySlug(slug, lang);
}
