"use client";

import { useCategoryDesk } from "@/features/categories/hooks/useCategoryDesk";
import {
  CategoryLatestGrid,
  CategoryOpeningPackage,
  DeskCompactStories,
  DeskContinuation,
  DeskEditorPicks,
  DeskEmptyNotice,
  DeskNotices,
  DeskRelatedSections,
  DeskTopicNavigation,
} from "@/features/categories/components/CategoryDeskParts";
import type { Article } from "@/shared/types/article.types";
import type { CategoryDetail } from "@/shared/types/category.types";

interface CategoryDeskProps {
  category: CategoryDetail;
  articles: Article[];
}

/** A single editorial desk template shared by every public category page. */
export function CategoryDesk({ category, articles }: CategoryDeskProps) {
  const model = useCategoryDesk(category.id, articles);

  return (
    <>
      <DeskTopicNavigation model={model} categorySlug={category.slug} />
      <DeskEmptyNotice model={model} />
      <DeskNotices model={model} />

      {model.lead ? (
        <CategoryOpeningPackage
          lead={model.lead}
          supporting={model.supporting}
        />
      ) : null}

      <CategoryLatestGrid articles={model.latest} />
      <DeskEditorPicks model={model} />
      <DeskCompactStories model={model} />
      <DeskRelatedSections model={model} categoryId={category.id} />
      <DeskContinuation model={model} />
    </>
  );
}
