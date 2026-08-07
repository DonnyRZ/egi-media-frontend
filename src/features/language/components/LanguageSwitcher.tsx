"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { cn } from "@/shared/lib/cn";
import { useArticleLocaleStore } from "@/shared/stores/article-locale.store";
import { useTaxonomyLocaleStore } from "@/shared/stores/taxonomy-locale.store";
import {
  LANGUAGE_OPTIONS,
  type LanguageOption,
} from "@/features/language/constants/language.constants";
import { getArticleHref } from "@/shared/utils/article-path";
import type { AppLocale } from "@/i18n/routing";
import type { ContentLocale } from "@/shared/types/article.types";

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function withQuery(pathname: string, query: string) {
  return query ? `${pathname}?${query}` : pathname;
}

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const articleId = useArticleLocaleStore((state) => state.articleId);
  const taxonomyKind = useTaxonomyLocaleStore((state) => state.kind);
  const taxonomyAlternates = useTaxonomyLocaleStore(
    (state) => state.slugAlternates,
  );
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const ref = useOutsideClick<HTMLDivElement>(close);
  const query = searchParams.toString();

  const active =
    LANGUAGE_OPTIONS.find((option) => option.locale === locale) ??
    LANGUAGE_OPTIONS[0];

  function hrefForLocale(targetLocale: AppLocale) {
    if (pathname.startsWith("/articles/") && articleId) {
      return withQuery(getArticleHref({ id: articleId }), query);
    }

    if (
      taxonomyKind &&
      taxonomyAlternates &&
      (pathname.startsWith("/categories/") || pathname.startsWith("/topics/"))
    ) {
      const nextSlug =
        taxonomyAlternates[targetLocale as ContentLocale] ??
        taxonomyAlternates[locale as ContentLocale];
      if (nextSlug) {
        return withQuery(`/${taxonomyKind}/${nextSlug}`, query);
      }
    }

    return withQuery(pathname, query);
  }

  return (
    <div ref={ref} className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("language")}
        className="flex items-center gap-1.5 rounded p-2 text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        onClick={() => setIsOpen((previous) => !previous)}
        type="button"
      >
        <GlobeIcon />
        <span className="text-xs font-bold uppercase tracking-wide">
          {active.code}
        </span>
      </button>

      {isOpen ? (
        <ul
          className="absolute right-0 z-50 mt-1 w-44 border border-neutral-200 bg-white py-1 shadow-md"
          role="menu"
        >
          {LANGUAGE_OPTIONS.map((option: LanguageOption) => (
            <li key={option.locale} role="none">
              <Link
                className={cn(
                  "flex items-center justify-between px-4 py-2 text-sm hover:bg-neutral-100",
                  option.locale === locale
                    ? "font-semibold text-accent"
                    : "text-neutral-700",
                )}
                href={hrefForLocale(option.locale)}
                locale={option.locale}
                onClick={close}
                role="menuitem"
              >
                <span>{option.name}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                  {option.code}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
