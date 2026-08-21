"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { ContactFormFields } from "@/features/contact/components/ContactFormFields";
import { ContactFormSuccess } from "@/features/contact/components/ContactFormSuccess";
import type { ContactFormValues } from "@/features/contact/types/contact.types";

const EMPTY: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "general",
  message: "",
};

export function ContactForm() {
  const t = useTranslations("contact");
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  function updateField<Key extends keyof ContactFormValues>(
    key: Key,
    value: ContactFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setValues(EMPTY);
      setIsSuccess(true);
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return <ContactFormSuccess />;
  }

  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <ContactFormFields
        disabled={isSubmitting}
        onChange={updateField}
        values={values}
      />

      {hasError ? (
        <p
          className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          role="alert"
        >
          {t("formError")}
        </p>
      ) : null}

      <button
        className="inline-flex w-full items-center justify-center rounded-none bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? t("formSending") : t("formSubmit")}
      </button>
    </form>
  );
}
