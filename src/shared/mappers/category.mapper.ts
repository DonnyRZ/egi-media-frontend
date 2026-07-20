import type { ContentLocale } from "@/shared/types/article.types";
import type {
  Category,
  CategoryDetail,
  CategoryListResult,
  CategoryTranslation,
} from "@/shared/types/category.types";

interface CategoryTranslationDto {
  name: string;
  slug: string | null;
  description: string | null;
}

interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
  translations?: Partial<Record<ContentLocale, CategoryTranslationDto>>;
}

interface CategoryListResponseDto {
  items: CategoryDto[];
  meta: { total: number };
}

function mapTranslations(
  dto: CategoryDto,
): Partial<Record<ContentLocale, CategoryTranslation>> {
  const translations: Partial<Record<ContentLocale, CategoryTranslation>> = {};

  for (const [locale, translation] of Object.entries(dto.translations ?? {})) {
    if (!translation) continue;
    translations[locale as ContentLocale] = {
      name: translation.name,
      slug: translation.slug,
      description: translation.description,
    };
  }

  return translations;
}

export function mapCategoryDto(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
  };
}

export function mapCategoryDetailDto(dto: CategoryDto): CategoryDetail {
  const locale = dto.locale ?? "id";
  const translations = mapTranslations(dto);

  if (!translations[locale]) {
    translations[locale] = {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    };
  }

  return {
    ...mapCategoryDto(dto),
    locale,
    availableLocales: dto.available_locales ?? [locale],
    translations,
  };
}

export function mapCategoryListDto(dto: CategoryListResponseDto): CategoryListResult {
  return {
    items: (dto.items ?? []).map(mapCategoryDto),
    total: dto.meta?.total ?? 0,
  };
}
