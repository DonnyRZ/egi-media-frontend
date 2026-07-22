"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { requestPasswordReset } from "@/features/auth/services/auth.service";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { TextField } from "@/shared/components/ui/TextField";
import { ApiError } from "@/shared/lib/errors";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormError(null);
    try {
      await requestPasswordReset(values.email);
      setSubmittedEmail(values.email);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t("errors.forgotPasswordFailed");
      setFormError(message);
    }
  }

  if (submittedEmail) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">
            {t("forgotSentTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {t("forgotSentBody", { email: submittedEmail })}
          </p>
        </div>
        <Link
          className="inline-flex w-full items-center justify-center border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-neutral-50"
          href="/login"
        >
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {t("forgotTitle")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">{t("forgotSubtitle")}</p>
      </div>

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoComplete="email"
          error={errors.email?.message}
          label={t("email")}
          type="email"
          {...register("email")}
        />

        {formError ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <Button
          className="w-full rounded-none"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? t("forgotSending") : t("forgotSubmit")}
        </Button>
      </form>

      <p className="text-sm text-neutral-600">
        <Link className="font-semibold text-ink hover:text-accent" href="/login">
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}
