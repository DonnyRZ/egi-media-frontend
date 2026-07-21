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
import type { CmsTaxonomyItem } from "@/features/cms/services/cms-taxonomy.service";

const SINGULAR: Record<TaxonomyKind, string> = {
  category: "Category",
  topic: "Topic",
  series: "Series",
  tag: "Tag",
};

interface FormState {
  kind: TaxonomyKind;
  editing: CmsTaxonomyItem | null;
}

export function TaxonomyView() {
  const toast = useToast();
  const { canManageTaxonomy } = usePermissions();

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

  const sections: {
    kind: TaxonomyKind;
    title: string;
    description: string;
    data: ReturnType<typeof useCmsCategories>;
  }[] = [
    {
      kind: "category",
      title: "Categories",
      description: "Top-level sections, e.g. Sport, Business, Politics.",
      data: categories,
    },
    {
      kind: "topic",
      title: "Topics",
      description: "Themes within a category, e.g. Football, Elections.",
      data: topics,
    },
    {
      kind: "series",
      title: "Series",
      description: "Multi-part story collections, e.g. World Cup 2026.",
      data: series,
    },
    {
      kind: "tag",
      title: "Tags",
      description: "Free-form keywords for granular discovery.",
      data: tags,
    },
  ];

  const activeMutation = form ? mutationsFor(form.kind) : null;

  return (
    <>
      <PageHeader
        title="Taxonomy"
        description="Organize content: Category → Topic → Series → Tag. Counts show how many articles use each."
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <TaxonomySection
            key={section.kind}
            kind={section.kind}
            title={section.title}
            description={section.description}
            singular={SINGULAR[section.kind]}
            items={section.data.data ?? []}
            isLoading={section.data.isLoading}
            isError={section.data.isError}
            canManage={canManageTaxonomy}
            onCreate={() => setForm({ kind: section.kind, editing: null })}
            onEdit={(item) => setForm({ kind: section.kind, editing: item })}
            onDelete={(item) =>
              setPendingDelete({ kind: section.kind, item })
            }
          />
        ))}
      </div>

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
