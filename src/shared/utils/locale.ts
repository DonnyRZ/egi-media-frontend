import type { AppLocale } from "@/i18n/routing";
import type { ContentLocale } from "@/shared/types/article.types";

export function toContentLocale(locale: string): ContentLocale {
  if (locale === "en" || locale === "uz" || locale === "id") {
    return locale;
  }
  return "id";
}

export function toAppLocale(locale: ContentLocale): AppLocale {
  return locale;
}
