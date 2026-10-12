"use client";
import { useCategoryDesk } from "@/features/categories/hooks/useCategoryDesk";
import {
  DeskEmptyNotice,
  DeskTopicNavigation,
  DeskNotices,
  DeskEditorPicks,
  DeskCompactStories,
  DeskRelatedSections,
  DeskContinuation,
} from "@/features/categories/components/CategoryDeskParts";
import { EditorialLead } from "@/shared/components/common/EditorialLead";
import type { Article } from "@/shared/types/article.types";
interface CategoryDeskProps {
  categoryId: string;
  articles: Article[];
}
export function CategoryDesk({ categoryId, articles }: CategoryDeskProps) {
  const model = useCategoryDesk(categoryId, articles);
  return (
    <>
      <DeskTopicNavigation model={model} />
      <DeskEmptyNotice model={model} />
      {model.lead ? (
        <EditorialLead
          lead={model.lead}
          supporting={model.supporting}
          latest={model.latest}
          latestHref={`/categories/${categoryId}?page=2`}
          video={model.videos.data?.items[0]}
        />
      ) : null}
      <DeskNotices model={model} />
      <DeskEditorPicks model={model} />
      <DeskCompactStories model={model} />
      <DeskRelatedSections model={model} categoryId={categoryId} />
      <DeskContinuation model={model} />
    </>
  );
}
