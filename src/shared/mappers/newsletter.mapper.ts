import type { Newsletter, NewsletterListResult } from "@/shared/types/newsletter.types";

interface NewsletterDto {
  id: string;
  title: string;
  description: string | null;
  frequency: Newsletter["frequency"];
}

interface NewsletterListResponseDto {
  items: NewsletterDto[];
  meta: { total: number };
}

export function mapNewsletterDto(dto: NewsletterDto): Newsletter {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    frequency: dto.frequency,
  };
}

export function mapNewsletterListDto(
  dto: NewsletterListResponseDto,
): NewsletterListResult {
  return {
    items: dto.items.map(mapNewsletterDto),
    total: dto.meta.total,
  };
}
