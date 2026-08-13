"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { submitDemoRequest } from "@/features/profesional/services/demo-request.service";

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMPTY = {
  full_name: "",
  company_name: "",
  job_title: "",
  work_email: "",
  phone: "",
  message: "",
  website: "",
};

export function ProfesionalDemoForm() {
  const t = useTranslations("profesional");
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<FormStatus>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await submitDemoRequest({
        full_name: values.full_name,
        company_name: values.company_name,
        job_title: values.job_title,
        work_email: values.work_email,
        phone: values.phone || undefined,
        message: values.message || undefined,
        website: values.website || undefined,
      });
      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="profesional-form-success">{t("formSuccess")}</p>;
  }

  return (
    <form className="profesional-form" onSubmit={onSubmit}>
      <label>
        {t("formName")}
        <input
          autoComplete="name"
          name="full_name"
          onChange={(event) => setValues({ ...values, full_name: event.target.value })}
          required
          value={values.full_name}
        />
      </label>
      <label>
        {t("formCompany")}
        <input
          autoComplete="organization"
          name="company_name"
          onChange={(event) => setValues({ ...values, company_name: event.target.value })}
          required
          value={values.company_name}
        />
      </label>
      <label>
        {t("formTitle")}
        <input
          autoComplete="organization-title"
          name="job_title"
          onChange={(event) => setValues({ ...values, job_title: event.target.value })}
          required
          value={values.job_title}
        />
      </label>
      <label>
        {t("formEmail")}
        <input
          autoComplete="email"
          name="work_email"
          onChange={(event) => setValues({ ...values, work_email: event.target.value })}
          required
          type="email"
          value={values.work_email}
        />
      </label>
      <label>
        {t("formPhone")}
        <input
          autoComplete="tel"
          name="phone"
          onChange={(event) => setValues({ ...values, phone: event.target.value })}
          type="tel"
          value={values.phone}
        />
      </label>
      <label>
        {t("formMessage")}
        <textarea
          name="message"
          onChange={(event) => setValues({ ...values, message: event.target.value })}
          rows={4}
          value={values.message}
        />
      </label>
      <div aria-hidden="true" className="profesional-honeypot">
        <label>
          {t("formHoneypot")}
          <input
            autoComplete="off"
            name="website"
            onChange={(event) => setValues({ ...values, website: event.target.value })}
            tabIndex={-1}
            value={values.website}
          />
        </label>
      </div>
      {status === "error" ? <p className="profesional-form-error">{t("formError")}</p> : null}
      <button className="profesional-cta" disabled={status === "submitting"} type="submit">
        {t("formSubmit")}
      </button>
    </form>
  );
}
