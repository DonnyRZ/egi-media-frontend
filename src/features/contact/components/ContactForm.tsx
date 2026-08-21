"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import {
  CONTACT_INQUIRY_TYPES,
  type ContactInquiryType,
} from "@/features/contact/constants/contact.constants";
import { cn } from "@/shared/lib/cn";

interface ContactFormValues {
  fullName: string;
  email: string;
  inquiryType: ContactInquiryType;
  message: string;
}

const EMPTY: ContactFormValues = {
  fullName: "",
  email: "",
  inquiryType: "general",
  message: "",
};

const fieldClass =
  "w-full rounded-none border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-600";

export function ContactForm() {
  const t = useTranslations("contact");
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Contact form payload (UI stub):", values);
    setSubmitted(true);
  }

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <div>
        <label className={labelClass} htmlFor="contact-full-name">
          {t("formFullName")}
        </label>
        <input
          autoComplete="name"
          className={fieldClass}
          id="contact-full-name"
          name="fullName"
          onChange={(event) =>
            setValues({ ...values, fullName: event.target.value })
          }
          required
          type="text"
          value={values.fullName}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-email">
          {t("formEmail")}
        </label>
        <input
          autoComplete="email"
          className={fieldClass}
          id="contact-email"
          name="email"
          onChange={(event) =>
            setValues({ ...values, email: event.target.value })
          }
          required
          type="email"
          value={values.email}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-inquiry-type">
          {t("formInquiryType")}
        </label>
        <select
          className={cn(fieldClass, "appearance-none bg-white")}
          id="contact-inquiry-type"
          name="inquiryType"
          onChange={(event) =>
            setValues({
              ...values,
              inquiryType: event.target.value as ContactInquiryType,
            })
          }
          required
          value={values.inquiryType}
        >
          {CONTACT_INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`inquiryTypes.${type}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-message">
          {t("formMessage")}
        </label>
        <textarea
          className={cn(fieldClass, "resize-y")}
          id="contact-message"
          name="message"
          onChange={(event) =>
            setValues({ ...values, message: event.target.value })
          }
          required
          rows={5}
          value={values.message}
        />
      </div>

      {submitted ? (
        <p
          className="border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700"
          role="status"
        >
          {t("formStubNotice")}
        </p>
      ) : null}

      <button
        className="inline-flex w-full items-center justify-center rounded-none bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 sm:w-auto"
        type="submit"
      >
        {t("formSubmit")}
      </button>
    </form>
  );
}
