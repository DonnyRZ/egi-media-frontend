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
  categoryOptions?: ParentOption[];
  topicOptions?: ParentOption[];
  saving: boolean;
  initial?: TaxonomyFormValues;
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
};

export function TaxonomyFormModal({
  open,
  title,
  withImage,
  nameOnly,
  requireCategory,
  requireTopic,
  categoryOptions = [],
  topicOptions = [],
  saving,
  initial,
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
    formState: { errors },
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
      });
    }
  }, [open, initial, reset]);

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
