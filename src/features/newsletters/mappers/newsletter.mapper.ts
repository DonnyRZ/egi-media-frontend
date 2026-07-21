import type {
  Newsletter,
  NewsletterFrequency,
  NewsletterListResult,
} from "@/features/newsletters/types/newsletter.types";
import type { PaginatedMeta } from "@/shared/types/api.types";

export interface NewsletterDto {
  id: string;
  name: string;
  description?: string | null;
  frequency: NewsletterFrequency;
  is_active: boolean;
  created_at: string;
}

export function mapNewsletter(dto: NewsletterDto): Newsletter {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    frequency: dto.frequency,
    isActive: dto.is_active,
    createdAt: dto.created_at,
  };
}

export function mapNewsletterList(
  items: NewsletterDto[],
  meta: PaginatedMeta,
): NewsletterListResult {
  return {
    items: items.map(mapNewsletter),
    total: meta.total,
    page: meta.page,
    totalPages: meta.total_pages,
  };
}
