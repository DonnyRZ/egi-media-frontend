"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Select } from "@/features/cms/components/ui/Select";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { CategoryTranslationFields } from "@/features/cms/components/taxonomy/CategoryTranslationFields";
import type {
  CategoryTranslationLocale,
  CmsCategoryTranslationState,
} from "@/features/cms/services/cms-taxonomy.service";
import {
  seriesFormSchema,
  taxonomyFormSchema,
  topicFormSchema,
  type SeriesFormValues,
  type TaxonomyFormValues as BaseTaxonomyFormValues,
  type TopicFormValues,
} from "@/features/cms/schemas/cms.schemas";

export interface TaxonomyFormValues {
  name: string;
  description?: string;
  image?: string;
  categoryId?: string;
  topicId?: string;
  translations?: {
    en?: { name?: string; description?: string };
    uz?: { name?: string; description?: string };
  };
}

interface ParentOption {
  value: string;
  label: string;
}

interface TaxonomyFormModalProps {
  open: boolean;
  title: string;
  withImage?: boolean;
  nameOnly?: boolean;
  requireCategory?: boolean;
  requireTopic?: boolean;
  categoryTranslations?: boolean;
  categoryOptions?: ParentOption[];
  topicOptions?: ParentOption[];
  saving: boolean;
  initial?: TaxonomyFormValues;
  translationState?: CmsCategoryTranslationState | null;
  retryingLocale?: CategoryTranslationLocale | null;
  onRetryTranslation?: (locale: CategoryTranslationLocale) => void;
  onClose: () => void;
  onSubmit: (values: TaxonomyFormValues) => void;
}

type FormValues = BaseTaxonomyFormValues &
  Partial<TopicFormValues> &
  Partial<SeriesFormValues>;

const EMPTY: FormValues = {
  name: "",
  description: "",
  image: "",
  categoryId: "",
  topicId: "",
  translations: {
    en: { name: "", description: "" },
    uz: { name: "", description: "" },
  },
};

export function TaxonomyFormModal({
  open,
  title,
  withImage,
  nameOnly,
  requireCategory,
  requireTopic,
  categoryTranslations,
  categoryOptions = [],
  topicOptions = [],
  saving,
  initial,
  translationState,
  retryingLocale,
  onRetryTranslation,
  onClose,
  onSubmit,
}: TaxonomyFormModalProps) {
  const schema = requireTopic
    ? seriesFormSchema
    : requireCategory
      ? topicFormSchema
      : taxonomyFormSchema;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset({
        ...EMPTY,
        ...initial,
        categoryId: initial?.categoryId ?? "",
        topicId: initial?.topicId ?? "",
        translations: {
          en: { name: initial?.translations?.en?.name ?? "", description: initial?.translations?.en?.description ?? "" },
          uz: { name: initial?.translations?.uz?.name ?? "", description: initial?.translations?.uz?.description ?? "" },
        },
      });
    }
  }, [open, initial, reset]);

  useEffect(() => {
    if (!open || !categoryTranslations || !translationState) return;
    for (const locale of ["en", "uz"] as const) {
      if (translationState.locales[locale].status !== "ready") continue;
      for (const field of ["name", "description"] as const) {
        const path = `translations.${locale}.${field}` as const;
        const dirty = dirtyFields.translations?.[locale]?.[field];
        const currentValue = getValues(path) || "";
        const translatedValue = translationState.translations[locale][field];
        if (!dirty && !currentValue && translatedValue) {
          setValue(path, translatedValue, { shouldDirty: false });
        }
      }
    }
  }, [categoryTranslations, dirtyFields.translations, getValues, open, setValue, translationState]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" htmlFor="tax-name" error={errors.name?.message} required>
          <Input id="tax-name" invalid={Boolean(errors.name)} {...register("name")} />
        </Field>
        {nameOnly ? null : (
          <Field label="Description" htmlFor="tax-desc" error={errors.description?.message}>
            <Textarea id="tax-desc" {...register("description")} />
          </Field>
        )}
        {categoryTranslations ? (
          <CategoryTranslationFields
            state={translationState}
            retryingLocale={retryingLocale}
            onRetry={onRetryTranslation}
            fields={{
              en: {
                name: register("translations.en.name"),
                description: register("translations.en.description"),
              },
              uz: {
                name: register("translations.uz.name"),
                description: register("translations.uz.description"),
              },
            }}
          />
        ) : null}
        {requireCategory ? (
          <Field
            label="Parent category"
            htmlFor="tax-category"
            error={errors.categoryId?.message}
            required
          >
            <Select
              id="tax-category"
              options={categoryOptions}
              placeholder="Select category…"
              invalid={Boolean(errors.categoryId)}
              {...register("categoryId")}
            />
          </Field>
        ) : null}
        {requireTopic ? (
          <Field
            label="Parent topic"
            htmlFor="tax-topic"
            error={errors.topicId?.message}
            required
          >
            <Select
              id="tax-topic"
              options={topicOptions}
              placeholder="Select topic…"
              invalid={Boolean(errors.topicId)}
              {...register("topicId")}
            />
          </Field>
        ) : null}
        {withImage ? (
          <Field label="Cover image URL" htmlFor="tax-image" error={errors.image?.message}>
            <Input id="tax-image" placeholder="https://…" {...register("image")} />
          </Field>
        ) : null}
      </div>
    </Modal>
  );
}
