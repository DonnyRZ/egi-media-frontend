import { fetchCategories } from "@/shared/services/category.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { Category, CategoryListResult } from "@/shared/types/category.types";
import { TAXONOMY_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

export async function getCategories(
  params: TaxonomyListParams,
): Promise<CategoryListResult> {
  return fetchCategories(params);
}

export async function getCategoriesPage(
  page = 1,
): Promise<CategoryListResult> {
  return fetchCategories({
    page,
    limit: TAXONOMY_PAGE_LIMIT,
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const result = await fetchCategories({
    page: 1,
    limit: TAXONOMY_PAGE_LIMIT,
  });

  return result.items.find((category) => category.slug === slug) ?? null;
}
