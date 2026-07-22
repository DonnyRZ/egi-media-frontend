"use client";

import { useState } from "react";

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

const SINGULAR: Record<TaxonomyKind, string> = {
  category: "Category",
  topic: "Topic",
  series: "Series",
  tag: "Tag",
};

const TABS: {
  kind: TaxonomyKind;
  title: string;
  description: string;
}[] = [
  {
    kind: "category",
    title: "Categories",
    description: "Top-level sections, e.g. Sport, Business, Politics.",
  },
  {
    kind: "topic",
    title: "Topics",
    description: "Themes within a category, e.g. Football, Elections.",
  },
  {
    kind: "series",
    title: "Series",
    description: "Multi-part story collections, e.g. World Cup 2026.",
  },
  {
    kind: "tag",
    title: "Tags",
    description: "Free-form keywords for granular discovery.",
  },
];

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

  const dataFor = (kind: TaxonomyKind) =>
    kind === "category"
      ? categories
      : kind === "topic"
        ? topics
        : kind === "series"
          ? series
          : tags;

  const mutationsFor = (kind: TaxonomyKind) =>
    kind === "category"
      ? categoryMutations
      : kind === "topic"
        ? topicMutations
        : kind === "series"
          ? seriesMutations
          : tagMutations;

  async function submit(values: TaxonomyFormValues) {
    if (!form) return;
    const { kind, editing } = form;
    const id = editing?.id;
    const base = { name: values.name, description: values.description };
    try {
      if (kind === "tag") {
        await tagMutations.save.mutateAsync({ id, name: values.name });
      } else if (kind === "series") {
        await seriesMutations.save.mutateAsync({
          id,
          payload: { ...base, image: values.image },
        });
      } else if (kind === "category") {
        await categoryMutations.save.mutateAsync({ id, payload: base });
      } else {
        await topicMutations.save.mutateAsync({ id, payload: base });
      }
      toast.success(`${SINGULAR[kind]} ${editing ? "updated" : "created"}`);
      setForm(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Could not save ${SINGULAR[kind].toLowerCase()}`,
      );
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const { kind, item } = pendingDelete;
    try {
      await mutationsFor(kind).remove.mutateAsync(item.id);
      toast.success(`${SINGULAR[kind]} deleted`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Could not delete ${SINGULAR[kind].toLowerCase()}`,
      );
    } finally {
      setPendingDelete(null);
    }
  }

  const active = TABS.find((tab) => tab.kind === activeTab) ?? TABS[0];
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
        {TABS.map((tab) => {
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
        singular={SINGULAR[active.kind]}
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
        title={`${form?.editing ? "Edit" : "New"} ${form ? SINGULAR[form.kind].toLowerCase() : ""}`}
        withImage={form?.kind === "series"}
        nameOnly={form?.kind === "tag"}
        saving={Boolean(activeMutation?.save.isPending)}
        initial={
          form?.editing
            ? {
                name: form.editing.name,
                description: form.editing.description ?? "",
                image: form.editing.image ?? "",
              }
            : undefined
        }
        onClose={() => setForm(null)}
        onSubmit={submit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete ? SINGULAR[pendingDelete.kind].toLowerCase() : ""}`}
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
