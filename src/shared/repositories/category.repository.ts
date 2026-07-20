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
import { TAXONOMY_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

export async function getCategories(
  params: TaxonomyListParams,
): Promise<CategoryListResult> {
  return fetchCategories(params);
}

export async function getCategoriesPage(
  page = 1,
  lang: ContentLocale = "id",
): Promise<CategoryListResult> {
  return fetchCategories({
    page,
    limit: TAXONOMY_PAGE_LIMIT,
    lang,
  });
}

export async function getCategoryBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<CategoryDetail | null> {
  return fetchCategoryBySlug(slug, lang);
}
