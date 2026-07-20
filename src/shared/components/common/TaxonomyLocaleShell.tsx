"use client";

import { useEffect, useMemo } from "react";

import {
  useTaxonomyLocaleStore,
  type TaxonomyKind,
  type TaxonomySlugAlternates,
} from "@/shared/stores/taxonomy-locale.store";
import type { ContentLocale } from "@/shared/types/article.types";

interface TaxonomyTranslation {
  name: string;
  slug: string | null;
  description: string | null;
}

interface TaxonomyLocaleEntity {
  id: string;
  slug: string;
  locale: ContentLocale;
  translations: Partial<Record<ContentLocale, TaxonomyTranslation>>;
}

interface TaxonomyLocaleShellProps {
  kind: TaxonomyKind;
  entity: TaxonomyLocaleEntity;
  children: React.ReactNode;
}

function buildSlugAlternates(
  entity: TaxonomyLocaleEntity,
): TaxonomySlugAlternates {
  const alternates: TaxonomySlugAlternates = {};

  for (const [locale, translation] of Object.entries(entity.translations)) {
    if (translation?.slug) {
      alternates[locale as ContentLocale] = translation.slug;
    }
  }

  alternates[entity.locale] = entity.slug;

  return alternates;
}

export function TaxonomyLocaleShell({
  kind,
  entity,
  children,
}: TaxonomyLocaleShellProps) {
  const setSlugAlternates = useTaxonomyLocaleStore(
    (state) => state.setSlugAlternates,
  );
  const clearSlugAlternates = useTaxonomyLocaleStore(
    (state) => state.clearSlugAlternates,
  );
  const alternates = useMemo(() => buildSlugAlternates(entity), [entity]);

  useEffect(() => {
    setSlugAlternates(kind, entity.id, alternates);
    return () => {
      const current = useTaxonomyLocaleStore.getState();
      if (current.entityId === entity.id && current.kind === kind) {
        clearSlugAlternates();
      }
    };
  }, [kind, entity.id, alternates, setSlugAlternates, clearSlugAlternates]);

  return <>{children}</>;
}
