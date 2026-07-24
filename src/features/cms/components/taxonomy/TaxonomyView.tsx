"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import {
  TaxonomyFormModal,
  type TaxonomyFormValues,
} from "@/features/cms/components/taxonomy/TaxonomyFormModal";
import { TaxonomySection } from "@/features/cms/components/taxonomy/TaxonomySection";
import {
  useCmsCategories,
  useCmsSeries,
  useCmsTags,
  useCmsTopics,
  type TaxonomyKind,
} from "@/features/cms/hooks/useCmsTaxonomy";
import {
  useCategoryMutations,
  useSeriesMutations,
  useTagMutations,
  useTopicMutations,
} from "@/features/cms/hooks/useTaxonomyMutations";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { cn } from "@/shared/lib/cn";
import type { CmsTaxonomyItem } from "@/features/cms/services/cms-taxonomy.service";
import { getMutationErrorMessage } from "@/features/cms/components/taxonomy/getMutationErrorMessage";
import {
  TAXONOMY_SINGULAR,
  TAXONOMY_TABS,
} from "@/features/cms/components/taxonomy/taxonomy.constants";

interface FormState {
  kind: TaxonomyKind;
  editing: CmsTaxonomyItem | null;
}

export function TaxonomyView() {
  const toast = useToast();
  const { canManageTaxonomy } = usePermissions();
  const [activeTab, setActiveTab] = useState<TaxonomyKind>("category");

  const categories = useCmsCategories();
  const topics = useCmsTopics();
  const series = useCmsSeries();
  const tags = useCmsTags();

  const categoryMutations = useCategoryMutations();
  const topicMutations = useTopicMutations();
  const seriesMutations = useSeriesMutations();
  const tagMutations = useTagMutations();

  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    kind: TaxonomyKind;
    item: CmsTaxonomyItem;
  } | null>(null);

  const categoryOptions = useMemo(
    () =>
      (categories.data ?? []).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [categories.data],
  );

  const topicOptions = useMemo(
    () =>
      (topics.data ?? []).map((item) => ({
        value: item.id,
        label: item.category
          ? `${item.name} (${item.category.name})`
          : item.name,
      })),
    [topics.data],
  );

  const dataByKind = { category: categories, topic: topics, series, tag: tags };
  const mutationsByKind = {
    category: categoryMutations,
    topic: topicMutations,
    series: seriesMutations,
    tag: tagMutations,
  };
  const dataFor = (kind: TaxonomyKind) => dataByKind[kind];
  const mutationsFor = (kind: TaxonomyKind) => mutationsByKind[kind];

  async function submit(values: TaxonomyFormValues) {
    if (!form) return;
    const { kind, editing } = form;
    const id = editing?.id;
    const base = { name: values.name, description: values.description };
    try {
      if (kind === "tag") {
        await tagMutations.save.mutateAsync({ id, name: values.name });
      } else if (kind === "series") {
        if (!values.topicId) {
          toast.error("Parent topic is required");
          return;
        }
        await seriesMutations.save.mutateAsync({
          id,
          payload: { ...base, image: values.image, topicId: values.topicId },
        });
      } else if (kind === "category") {
        await categoryMutations.save.mutateAsync({ id, payload: base });
      } else {
        if (!values.categoryId) {
          toast.error("Parent category is required");
          return;
        }
        await topicMutations.save.mutateAsync({
          id,
          payload: { ...base, categoryId: values.categoryId },
        });
      }
      toast.success(`${TAXONOMY_SINGULAR[kind]} ${editing ? "updated" : "created"}`);
      setForm(null);
    } catch (error) {
      toast.error(
        getMutationErrorMessage(
          error,
          `Could not save ${TAXONOMY_SINGULAR[kind].toLowerCase()}`,
        ),
      );
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const { kind, item } = pendingDelete;
    try {
      await mutationsFor(kind).remove.mutateAsync(item.id);
      toast.success(`${TAXONOMY_SINGULAR[kind]} deleted`);
    } catch (error) {
      toast.error(
        getMutationErrorMessage(
          error,
          `Could not delete ${TAXONOMY_SINGULAR[kind].toLowerCase()}`,
        ),
      );
    } finally {
      setPendingDelete(null);
    }
  }

  const active = TAXONOMY_TABS.find((tab) => tab.kind === activeTab) ?? TAXONOMY_TABS[0];
  const activeData = dataFor(active.kind);
  const activeMutation = form ? mutationsFor(form.kind) : null;

  return (
    <>
      <PageHeader
        title="Taxonomy"
        description="Organize content: Category → Topic → Series → Tag. Counts show how many articles use each."
      />

      <div
        role="tablist"
        aria-label="Taxonomy types"
        className="mb-6 flex flex-wrap gap-1 border-b border-neutral-200 dark:border-neutral-800"
      >
        {TAXONOMY_TABS.map((tab) => {
          const count = dataFor(tab.kind).data?.length ?? 0;
          const selected = tab.kind === activeTab;
          return (
            <button
              key={tab.kind}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab.kind)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-accent text-accent"
                  : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
              )}
            >
              {tab.title}
              <span className="ml-2 text-xs font-normal text-neutral-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <TaxonomySection
        kind={active.kind}
        title={active.title}
        description={active.description}
        singular={TAXONOMY_SINGULAR[active.kind]}
        items={activeData.data ?? []}
        isLoading={activeData.isLoading}
        isError={activeData.isError}
        canManage={canManageTaxonomy}
        onCreate={() => setForm({ kind: active.kind, editing: null })}
        onEdit={(item) => setForm({ kind: active.kind, editing: item })}
        onDelete={(item) => setPendingDelete({ kind: active.kind, item })}
      />

      <TaxonomyFormModal
        open={Boolean(form)}
        title={`${form?.editing ? "Edit" : "New"} ${form ? TAXONOMY_SINGULAR[form.kind].toLowerCase() : ""}`}
        withImage={form?.kind === "series"}
        nameOnly={form?.kind === "tag"}
        requireCategory={form?.kind === "topic"}
        requireTopic={form?.kind === "series"}
        categoryOptions={categoryOptions}
        topicOptions={topicOptions}
        saving={Boolean(activeMutation?.save.isPending)}
        initial={
          form?.editing
            ? {
                name: form.editing.name,
                description: form.editing.description ?? "",
                image: form.editing.image ?? "",
                categoryId: form.editing.categoryId ?? "",
                topicId: form.editing.topicId ?? "",
              }
            : undefined
        }
        onClose={() => setForm(null)}
        onSubmit={submit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete ? TAXONOMY_SINGULAR[pendingDelete.kind].toLowerCase() : ""}`}
        message={
          pendingDelete && pendingDelete.item.articleCount > 0
            ? `"${pendingDelete.item.name}" is used by ${pendingDelete.item.articleCount} article(s). Reassign them first.`
            : `Delete "${pendingDelete?.item.name}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        danger
        loading={Boolean(pendingDelete && mutationsFor(pendingDelete.kind).remove.isPending)}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}
