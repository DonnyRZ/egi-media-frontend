"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { cn } from "@/shared/lib/cn";
import { RichTextEditor } from "@/features/cms/components/editor/RichTextEditor";
import { slugify } from "@/features/cms/utils/slug";
import type { ArticleFormValues } from "@/features/cms/schemas/cms.schemas";

type Locale = "id" | "en" | "uz";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "id", label: "Indonesia" },
  { id: "en", label: "English" },
  { id: "uz", label: "Oʻzbekcha" },
];

const FIELD_NAMES: Record<
  Locale,
  {
    title: keyof ArticleFormValues;
    summary: keyof ArticleFormValues;
    content: keyof ArticleFormValues;
  }
> = {
  id: { title: "title", summary: "summary", content: "content" },
  en: { title: "titleEn", summary: "summaryEn", content: "contentEn" },
  uz: { title: "titleUz", summary: "summaryUz", content: "contentUz" },
};

interface ArticleLocaleFieldsProps {
  control: Control<ArticleFormValues>;
  register: UseFormRegister<ArticleFormValues>;
  errors: FieldErrors<ArticleFormValues>;
  title: string;
}

export function ArticleLocaleFields({
  control,
  register,
  errors,
  title,
}: ArticleLocaleFieldsProps) {
  const [locale, setLocale] = useState<Locale>("id");
  const names = FIELD_NAMES[locale];
  const isPrimary = locale === "id";
  const titleError = errors[names.title]?.message as string | undefined;
  const contentError = errors[names.content]?.message as string | undefined;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {LOCALES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              locale === item.id
                ? "bg-white text-accent shadow-sm dark:bg-neutral-900"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
            )}
          >
            {item.label}
            {item.id === "id" ? " (primary)" : ""}
          </button>
        ))}
      </div>

      <Field
        label="Title"
        htmlFor={`title-${locale}`}
        error={titleError}
        required={isPrimary}
      >
        <Input
          id={`title-${locale}`}
          placeholder="A compelling headline"
          invalid={Boolean(titleError)}
          {...register(names.title)}
        />
      </Field>

      {isPrimary ? (
        <p className="text-xs text-neutral-400">
          Slug: <span className="font-mono">{slugify(title) || "—"}</span>{" "}
          <span className="italic">(final slug generated on save)</span>
        </p>
      ) : (
        <p className="text-xs text-neutral-400">
          Optional for drafts. Title and content are required in all languages
          before Submit for review, Publish, or Schedule.
        </p>
      )}

      <Field label="Summary" htmlFor={`summary-${locale}`}>
        <Textarea
          id={`summary-${locale}`}
          placeholder="A short standfirst shown in listings"
          {...register(names.summary)}
        />
      </Field>

      <Field label="Content" error={contentError} required={isPrimary}>
        <Controller
          control={control}
          name={names.content}
          render={({ field }) => (
            <RichTextEditor
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              invalid={Boolean(contentError)}
            />
          )}
        />
      </Field>
    </div>
  );
}
