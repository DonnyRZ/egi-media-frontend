import type {
  Newsletter,
  NewsletterFrequency,
  NewsletterListResult,
} from "@/features/newsletters/types/newsletter.types";
import type { PaginatedMeta } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";

export interface NewsletterDto {
  id: string;
  name: string;
  description?: string | null;
  frequency: NewsletterFrequency;
  is_active: boolean;
  created_at: string;
  name_en?: string | null;
  name_uz?: string | null;
  description_en?: string | null;
  description_uz?: string | null;
}

function resolveName(dto: NewsletterDto, lang: ContentLocale): string {
  if (lang === "en") return dto.name_en?.trim() || dto.name;
  if (lang === "uz") return dto.name_uz?.trim() || dto.name;
  return dto.name;
}

function resolveDescription(
  dto: NewsletterDto,
  lang: ContentLocale,
): string | null {
  if (lang === "en") return dto.description_en?.trim() || dto.description || null;
  if (lang === "uz") return dto.description_uz?.trim() || dto.description || null;
  return dto.description ?? null;
}

export function mapNewsletter(
  dto: NewsletterDto,
  lang: ContentLocale = "id",
): Newsletter {
  return {
    id: dto.id,
    name: resolveName(dto, lang),
    description: resolveDescription(dto, lang),
    frequency: dto.frequency,
    isActive: dto.is_active,
    createdAt: dto.created_at,
  };
}

export function mapNewsletterList(
  items: NewsletterDto[],
  meta: PaginatedMeta,
  lang: ContentLocale = "id",
): NewsletterListResult {
  return {
    items: items.map((item) => mapNewsletter(item, lang)),
    total: meta.total,
    page: meta.page,
    totalPages: meta.total_pages,
  };
}
