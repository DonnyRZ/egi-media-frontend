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
import { useCategoryTranslations } from "@/features/cms/hooks/useCategoryTranslations";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { cn } from "@/shared/lib/cn";
import {
  type CategoryTranslationLocale,
  type CmsCategoryTranslationState,
  type CmsTaxonomyItem,
} from "@/features/cms/services/cms-taxonomy.service";
import { getMutationErrorMessage } from "@/features/cms/components/taxonomy/getMutationErrorMessage";
import {
  TAXONOMY_SINGULAR,
  TAXONOMY_TABS,
} from "@/features/cms/components/taxonomy/taxonomy.constants";

interface FormState {
  kind: TaxonomyKind;
  editing: CmsTaxonomyItem | null;
  translations?: CmsCategoryTranslationState["translations"];
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
  const categoryTranslations = useCategoryTranslations(
    form?.kind === "category" ? form.editing?.id : undefined,
  );
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

  function openCreate(kind: TaxonomyKind) {
    categoryTranslations.clear();
    setForm({ kind, editing: null });
  }

  async function openEdit(kind: TaxonomyKind, item: CmsTaxonomyItem) {
    if (kind !== "category") {
      categoryTranslations.clear();
      setForm({ kind, editing: item });
      return;
    }
    try {
      const state = await categoryTranslations.load(item.id);
      setForm({ kind, editing: item, translations: state.translations });
    } catch (error) {
      toast.error(getMutationErrorMessage(error, "Could not load category translations"));
    }
  }

  async function retryTranslation(locale: CategoryTranslationLocale) {
    const id = form?.kind === "category" ? form.editing?.id : undefined;
    if (!id) return;
    try {
      const { status, error, latest } = await categoryTranslations.retry(id, locale);
      if (status === "failed") {
        toast.error(error || latest.locales[locale].lastError || "Translation retry could not be queued");
      } else {
        toast.info(status === "pending" ? "Translation retry queued" : "Translation is already ready");
      }
    } catch (error) {
      toast.error(getMutationErrorMessage(error, "Could not retry translation"));
    }
  }

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
        const result = await categoryMutations.save.mutateAsync({
          id,
          payload: {
            ...base,
            translations: {
              en: { name: values.translations?.en?.name ?? "", description: values.translations?.en?.description ?? "" },
              uz: { name: values.translations?.uz?.name ?? "", description: values.translations?.uz?.description ?? "" },
            },
          },
        });
        toast.success(`${TAXONOMY_SINGULAR[kind]} ${editing ? "updated" : "created"}`);
        if (!editing) {
          const categoryId = (result as { id?: string } | undefined)?.id;
          if (categoryId) {
            try {
              const state = await categoryTranslations.load(categoryId);
              setForm({
                kind,
                translations: state.translations,
                editing: {
                  id: categoryId,
                  name: values.name,
                  slug: null,
                  description: values.description || null,
                  image: null,
                  articleCount: 0,
                  categoryId: null,
                  category: null,
                  topicId: null,
                  topic: null,
                },
              });
              return;
            } catch {
              toast.info("Category saved. Translation status can be checked by editing it.");
            }
          }
        }
        setForm(null);
        return;
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
  const initialValues = useMemo(() => form?.editing ? {
    name: form.editing.name,
    description: form.editing.description ?? "",
    image: form.editing.image ?? "",
    categoryId: form.editing.categoryId ?? "",
    topicId: form.editing.topicId ?? "",
    translations: form.translations,
  } : undefined, [form]);

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
      onCreate={() => openCreate(active.kind)}
      onEdit={(item) => { void openEdit(active.kind, item); }}
        onDelete={(item) => setPendingDelete({ kind: active.kind, item })}
      />

      <TaxonomyFormModal
        open={Boolean(form)}
        title={`${form?.editing ? "Edit" : "New"} ${form ? TAXONOMY_SINGULAR[form.kind].toLowerCase() : ""}`}
        withImage={form?.kind === "series"}
        nameOnly={form?.kind === "tag"}
        requireCategory={form?.kind === "topic"}
        requireTopic={form?.kind === "series"}
        categoryTranslations={form?.kind === "category"}
        categoryOptions={categoryOptions}
        topicOptions={topicOptions}
        saving={Boolean(activeMutation?.save.isPending)}
        translationState={categoryTranslations.state}
        retryingLocale={categoryTranslations.retryingLocale}
        onRetryTranslation={retryTranslation}
        initial={initialValues}
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
