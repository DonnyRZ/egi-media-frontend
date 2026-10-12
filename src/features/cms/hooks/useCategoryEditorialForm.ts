"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategoryOptions } from "@/features/cms/hooks/useTaxonomyOptions";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import {
  fetchArticles,
  fetchArticleById,
} from "@/shared/services/article.service";
import {
  fetchCategoryEditorial,
  saveCategoryEditorial,
} from "@/shared/services/editorial.service";
import { selectCategoryPackage } from "@/shared/utils/category-selection";
import type { CategoryEditorial } from "@/shared/types/editorial.types";
import type { Article } from "@/shared/types/article.types";
function useCategoryDraft() {
  const initialized = useRef("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [lead, setLead] = useState("");
  const [support, setSupport] = useState<string[]>(Array(5).fill(""));
  const [editors, setEditors] = useState<string[]>(Array(4).fill(""));
  return {
    initialized,
    category,
    setCategory,
    search,
    setSearch,
    lead,
    setLead,
    support,
    setSupport,
    editors,
    setEditors,
  };
}
type Draft = ReturnType<typeof useCategoryDraft>;
function useCategoryQueries(
  category: string,
  search: string,
  enabled: boolean,
) {
  const config = useQuery({
    queryKey: ["cms-category-layout", category],
    queryFn: () => fetchCategoryEditorial(category, "id"),
    enabled: enabled && Boolean(category),
  });
  const options = useQuery({
    queryKey: ["cms-category-stories", category, search],
    queryFn: () => fetchArticles({ category_id: category, search, limit: 100 }),
    enabled: enabled && Boolean(category),
  });
  return { config, options };
}
function usePinnedChoices(
  draft: Draft,
  config: CategoryEditorial | undefined,
  enabled: boolean,
) {
  const ids = [
    ...new Set(
      [
        config?.lead_id,
        ...(config?.supporting_ids || []),
        ...(config?.editor_ids || []),
        draft.lead,
        ...draft.support,
        ...draft.editors,
      ].filter((id): id is string => Boolean(id)),
    ),
  ];
  return useQuery({
    queryKey: ["cms-category-pinned", draft.category, ids],
    enabled: enabled && ids.length > 0,
    queryFn: async () => {
      const results = await Promise.allSettled(
        ids.map((id) => fetchArticleById(id)),
      );
      return results.flatMap((x) =>
        x.status === "fulfilled" && x.value.category?.id === draft.category
          ? [x.value]
          : [],
      );
    },
  });
}
function useRestoreCategoryDraft(
  draft: Draft,
  config: CategoryEditorial | undefined,
) {
  useEffect(() => {
    const curated = config?.curated;
    if (!curated || draft.initialized.current === draft.category) return;
    draft.initialized.current = draft.category;
    draft.setLead(curated.lead_id || "");
    draft.setSupport(
      Array.from({ length: 5 }, (_, i) => curated.supporting_ids[i] || ""),
    );
    draft.setEditors(
      Array.from({ length: 4 }, (_, i) => curated.editor_ids[i] || ""),
    );
  }, [config, draft]);
}
function useCategoryFeedback(category: string) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  useEffect(() => {
    setSaved(false);
    setSaveError(null);
  }, [category]);
  return { saving, setSaving, saved, setSaved, saveError, setSaveError };
}
function duplicateOpening(draft: Draft) {
  const ids = [draft.lead, ...draft.support].filter(Boolean);
  return new Set(ids).size !== ids.length;
}
function useSaveCategory(draft: Draft) {
  const client = useQueryClient();
  const toast = useToast();
  const feedback = useCategoryFeedback(draft.category);
  async function save() {
    feedback.setSaveError(null);
    feedback.setSaved(false);
    if (duplicateOpening(draft)) {
      feedback.setSaveError(
        "Lead dan pendamping harus berbeda. Pilih satu artikel untuk setiap posisi pembuka.",
      );
      return;
    }
    feedback.setSaving(true);
    try {
      await saveCategoryEditorial(draft.category, {
        lead_id: draft.lead || null,
        supporting_ids: draft.support.filter(Boolean),
        editor_ids: draft.editors.filter(Boolean),
      });
      await client.invalidateQueries();
      feedback.setSaved(true);
      toast.success("Category layout saved");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save layout";
      feedback.setSaveError(message);
      toast.error(message);
    } finally {
      feedback.setSaving(false);
    }
  }
  return { ...feedback, save };
}
function resetCategoryDraft(draft: Draft, value: string) {
  draft.initialized.current = "";
  draft.setCategory(value);
  draft.setLead("");
  draft.setSupport(Array(5).fill(""));
  draft.setEditors(Array(4).fill(""));
  draft.setSearch("");
}
function buildDraftPreview(
  draft: Draft,
  config: CategoryEditorial | undefined,
  articles: Article[],
) {
  const selection = selectCategoryPackage(draft.category, articles, articles, {
    category_id: draft.category,
    lead_id: draft.lead || config?.lead_id || null,
    supporting_ids: draft.support.filter(Boolean),
    editor_ids: draft.editors.filter(Boolean),
    topics: [],
  });
  return { previewLead: selection.lead, previewSupport: selection.supporting };
}
export function useCategoryEditorialForm() {
  const { isSuperadmin } = usePermissions();
  const categories = useCategoryOptions();
  const draft = useCategoryDraft();
  const queries = useCategoryQueries(
    draft.category,
    draft.search,
    isSuperadmin,
  );
  const pinned = usePinnedChoices(draft, queries.config.data, isSuperadmin);
  useRestoreCategoryDraft(draft, queries.config.data);
  const feedback = useSaveCategory(draft);
  const articles = Array.from(
    new Map(
      [...(queries.options.data?.items || []), ...(pinned.data || [])].map(
        (a) => [a.id, a],
      ),
    ).values(),
  );
  const choices = [
    { value: "", label: "Automatic / no pinned selection" },
    ...articles.map((a) => ({ value: a.id, label: a.title })),
  ];
  return {
    ...draft,
    ...queries,
    ...feedback,
    ...buildDraftPreview(draft, queries.config.data, articles),
    isSuperadmin,
    categories,
    articles,
    choices,
    changeCategory: (value: string) => resetCategoryDraft(draft, value),
  };
}
