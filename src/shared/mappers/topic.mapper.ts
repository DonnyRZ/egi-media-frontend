import type { ContentLocale } from "@/shared/types/article.types";
import type {
  Topic,
  TopicDetail,
  TopicListResult,
  TopicTranslation,
} from "@/shared/types/topic.types";

interface TopicTranslationDto {
  name: string;
  slug: string | null;
  description: string | null;
}

interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
  translations?: Partial<Record<ContentLocale, TopicTranslationDto>>;
}

interface TopicListResponseDto {
  items: TopicDto[];
  meta: { total: number };
}

function mapTranslations(
  dto: TopicDto,
): Partial<Record<ContentLocale, TopicTranslation>> {
  const translations: Partial<Record<ContentLocale, TopicTranslation>> = {};

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

export function mapTopicDto(dto: TopicDto): Topic {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
  };
}

export function mapTopicDetailDto(dto: TopicDto): TopicDetail {
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
    ...mapTopicDto(dto),
    locale,
    availableLocales: dto.available_locales ?? [locale],
    translations,
  };
}

export function mapTopicListDto(dto: TopicListResponseDto): TopicListResult {
  return {
    items: (dto.items ?? []).map(mapTopicDto),
    total: dto.meta?.total ?? 0,
  };
}
