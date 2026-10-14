"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import type {
  CategoryTranslationLocale,
  CategoryTranslationStatus,
  CmsCategoryTranslationState,
} from "@/features/cms/services/cms-taxonomy.service";

interface Props {
  state: CmsCategoryTranslationState | null | undefined;
  retryingLocale?: CategoryTranslationLocale | null;
  onRetry?: (locale: CategoryTranslationLocale) => void;
  fields: Record<CategoryTranslationLocale, {
    name: UseFormRegisterReturn;
    description: UseFormRegisterReturn;
  }>;
}

export function CategoryTranslationFields({ state, retryingLocale, onRetry, fields }: Props) {
  return (
    <div className="space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Optional translations</h3>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Leave a field blank to let AI translate it from Indonesian.</p>
      </div>
      {(["en", "uz"] as const).map((locale) => {
        const localeState = state?.locales[locale];
        return (
          <section key={locale} className="space-y-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold">{locale === "en" ? "English" : "Uzbek"}</h4>
              <TranslationStatus status={localeState?.status ?? "none"} />
            </div>
            <Field label={`${locale.toUpperCase()} name`} htmlFor={`tax-name-${locale}`}>
              <Input id={`tax-name-${locale}`} maxLength={100} {...fields[locale].name} />
            </Field>
            <Field label={`${locale.toUpperCase()} description`} htmlFor={`tax-desc-${locale}`}>
              <Textarea id={`tax-desc-${locale}`} maxLength={1000} {...fields[locale].description} />
            </Field>
            {localeState?.status === "failed" ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-error">Translation failed. Check AI settings or try again.</p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  loading={retryingLocale === locale}
                  disabled={!onRetry || Boolean(retryingLocale)}
                  onClick={() => onRetry?.(locale)}
                >
                  Retry
                </Button>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function TranslationStatus({ status }: { status: CategoryTranslationStatus }) {
  const labels: Record<CategoryTranslationStatus, string> = {
    none: "Not started",
    pending: "Waiting",
    processing: "Translating",
    ready: "Ready",
    failed: "Failed",
  };
  const colors: Record<CategoryTranslationStatus, string> = {
    none: "text-neutral-500",
    pending: "text-amber-600 dark:text-amber-400",
    processing: "text-amber-600 dark:text-amber-400",
    ready: "text-emerald-700 dark:text-emerald-400",
    failed: "text-error",
  };
  return <span className={`text-xs font-medium ${colors[status]}`}>{labels[status]}</span>;
}
