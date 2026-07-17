import type { AppLocale } from "@/i18n/routing";

export interface LanguageOption {
  locale: AppLocale;
  code: string;
  name: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { locale: "id", code: "ID", name: "Bahasa Indonesia" },
  { locale: "en", code: "EN", name: "English" },
  { locale: "uz", code: "UZ", name: "Oʻzbekcha" },
];
