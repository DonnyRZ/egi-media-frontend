"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import {
  seriesFormSchema,
  type SeriesFormValues,
} from "@/features/cms/schemas/cms.schemas";

export interface TaxonomyFormValues {
  name: string;
  description?: string;
  image?: string;
}

interface TaxonomyFormModalProps {
  open: boolean;
  title: string;
  withImage?: boolean;
  nameOnly?: boolean;
  saving: boolean;
  initial?: TaxonomyFormValues;
  onClose: () => void;
  onSubmit: (values: TaxonomyFormValues) => void;
}

const EMPTY: SeriesFormValues = { name: "", description: "", image: "" };

export function TaxonomyFormModal({
  open,
  title,
  withImage,
  nameOnly,
  saving,
  initial,
  onClose,
  onSubmit,
}: TaxonomyFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesFormSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset({ ...EMPTY, ...initial });
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
        {withImage ? (
          <Field label="Cover image URL" htmlFor="tax-image" error={errors.image?.message}>
            <Input id="tax-image" placeholder="https://…" {...register("image")} />
          </Field>
        ) : null}
      </div>
    </Modal>
  );
}
