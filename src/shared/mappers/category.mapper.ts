import type { Category, CategoryListResult } from "@/shared/types/category.types";

interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryListResponseDto {
  items: CategoryDto[];
  meta: { total: number };
}

export function mapCategoryDto(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
  };
}

export function mapCategoryListDto(dto: CategoryListResponseDto): CategoryListResult {
  return {
    items: (dto.items ?? []).map(mapCategoryDto),
    total: dto.meta?.total ?? 0,
  };
}
