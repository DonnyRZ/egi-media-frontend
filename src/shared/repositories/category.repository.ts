import { fetchCategories } from "@/shared/services/category.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { CategoryListResult } from "@/shared/types/category.types";

export async function getCategories(
  params: TaxonomyListParams,
): Promise<CategoryListResult> {
  return fetchCategories(params);
}
