"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { RichTextEditor } from "@/features/cms/components/editor/RichTextEditor";
import { slugify } from "@/features/cms/utils/slug";
import type { ArticleFormValues } from "@/features/cms/schemas/cms.schemas";

type OverrideLocale = "en" | "uz";

const OVERRIDE_LOCALES: { id: OverrideLocale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "uz", label: "Oʻzbekcha" },
];

const OVERRIDE_FIELDS: Record<
  OverrideLocale,
  {
    title: keyof ArticleFormValues;
    summary: keyof ArticleFormValues;
    content: keyof ArticleFormValues;
  }
> = {
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
  const [showOverrides, setShowOverrides] = useState(false);
  const [overrideLocale, setOverrideLocale] = useState<OverrideLocale>("en");
  const overrideNames = OVERRIDE_FIELDS[overrideLocale];
  const titleError = errors.title?.message as string | undefined;
  const contentError = errors.content?.message as string | undefined;
  const summaryError = errors.summary?.message;
  const summary = useWatch({ control, name: "summary" }) ?? "";

  useEffect(() => {
    if (errors.titleEn || errors.summaryEn || errors.contentEn) {
      setShowOverrides(true);
      setOverrideLocale("en");
    } else if (errors.titleUz || errors.summaryUz || errors.contentUz) {
      setShowOverrides(true);
      setOverrideLocale("uz");
    }
  }, [errors]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300">
        Write in <strong className="font-medium text-neutral-800 dark:text-neutral-100">Indonesian</strong>.
        English and Oʻzbekcha are filled by AI when you publish or schedule.
      </div>

      <Field label="Title" htmlFor="title-id" error={titleError} required>
        <Input
          id="title-id"
          placeholder="A compelling headline"
          invalid={Boolean(titleError)}
          {...register("title")}
        />
      </Field>

      <p className="text-xs text-neutral-400">
        Slug: <span className="font-mono">{slugify(title) || "—"}</span>{" "}
        <span className="italic">(final slug generated on save)</span>
      </p>

      <Field label="Summary" htmlFor="summary-id" error={summaryError} hint={`${summary.length}/500 characters for the Indonesian summary.`}>
        <Textarea
          id="summary-id"
          placeholder="A short standfirst shown in listings"
          invalid={Boolean(summaryError)}
          {...register("summary")}
        />
      </Field>

      <Field label="Content" error={contentError} required>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              invalid={Boolean(contentError)}
            />
          )}
        />
      </Field>

      <div className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setShowOverrides((open) => !open)}
          className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline dark:hover:text-neutral-200"
        >
          {showOverrides ? "Hide translation override" : "Optional: override AI translation"}
        </button>

        {showOverrides && (
          <div className="mt-3 space-y-4 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-neutral-700">
            <p className="text-xs text-neutral-500">
              Leave empty to let AI generate translations on publish/schedule.
              Fill only if you need a manual override.
            </p>

            <div className="flex gap-2">
              {OVERRIDE_LOCALES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOverrideLocale(item.id)}
                  className={
                    overrideLocale === item.id
                      ? "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : "rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Field label="Title" htmlFor={`title-${overrideLocale}`} error={errors[overrideNames.title]?.message as string | undefined}>
              <Input
                id={`title-${overrideLocale}`}
                placeholder="Optional override headline"
                invalid={Boolean(errors[overrideNames.title])}
                {...register(overrideNames.title)}
              />
            </Field>

            <Field label="Summary" htmlFor={`summary-${overrideLocale}`} error={errors[overrideNames.summary]?.message as string | undefined}>
              <Textarea
                id={`summary-${overrideLocale}`}
                placeholder="Optional override summary"
                invalid={Boolean(errors[overrideNames.summary])}
                {...register(overrideNames.summary)}
              />
            </Field>

            <Field label="Content" error={errors[overrideNames.content]?.message as string | undefined}>
              <Controller
                control={control}
                name={overrideNames.content}
                render={({ field }) => (
                  <RichTextEditor
                    value={(field.value as string) ?? ""}
                    onChange={field.onChange}
                    invalid={Boolean(errors[overrideNames.content])}
                  />
                )}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
