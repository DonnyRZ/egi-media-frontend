import { useTranslations } from "next-intl";

import { ContactTextField } from "@/features/contact/components/ContactTextField";
import {
  CONTACT_INQUIRY_TYPES,
  type ContactInquiryType,
} from "@/features/contact/constants/contact.constants";
import type { ContactFormValues } from "@/features/contact/types/contact.types";
import { cn } from "@/shared/lib/cn";

const fieldClass =
  "w-full rounded-none border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-600";

interface ContactFormFieldsProps {
  disabled: boolean;
  values: ContactFormValues;
  onChange: <Key extends keyof ContactFormValues>(
    key: Key,
    value: ContactFormValues[Key],
  ) => void;
}

export function ContactFormFields({
  disabled,
  values,
  onChange,
}: ContactFormFieldsProps) {
  const t = useTranslations("contact");

  return (
    <>
      <ContactTextField
        autoComplete="name"
        disabled={disabled}
        id="contact-full-name"
        label={t("formFullName")}
        name="fullName"
        onChange={(value) => onChange("fullName", value)}
        value={values.fullName}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ContactTextField
          autoComplete="email"
          disabled={disabled}
          id="contact-email"
          label={t("formEmail")}
          name="email"
          onChange={(value) => onChange("email", value)}
          type="email"
          value={values.email}
        />
        <ContactTextField
          autoComplete="tel"
          disabled={disabled}
          id="contact-phone"
          label={t("formPhone")}
          name="phone"
          onChange={(value) => onChange("phone", value)}
          type="tel"
          value={values.phone}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-inquiry-type">
          {t("formInquiryType")}
        </label>
        <select
          className={cn(fieldClass, "appearance-none bg-white")}
          disabled={disabled}
          id="contact-inquiry-type"
          name="inquiryType"
          onChange={(event) =>
            onChange("inquiryType", event.target.value as ContactInquiryType)
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
          disabled={disabled}
          id="contact-message"
          name="message"
          onChange={(event) => onChange("message", event.target.value)}
          required
          rows={5}
          value={values.message}
        />
      </div>
    </>
  );
}
