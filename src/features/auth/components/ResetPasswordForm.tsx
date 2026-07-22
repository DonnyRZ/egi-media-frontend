"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { resetPasswordWithToken } from "@/features/auth/services/auth.service";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { PasswordField } from "@/shared/components/ui/PasswordField";
import { ApiError } from "@/shared/lib/errors";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [formError, setFormError] = useState<string | null>(
    token ? null : t("errors.missingResetToken"),
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordMin: t("validation.passwordMin"),
        confirmRequired: t("validation.confirmRequired"),
        passwordMismatch: t("validation.passwordMismatch"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setFormError(t("errors.missingResetToken"));
      return;
    }

    setFormError(null);
    try {
      await resetPasswordWithToken(token, values.password);
      setIsSuccess(true);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t("errors.resetPasswordFailed");
      setFormError(message);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">
            {t("resetSuccessTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {t("resetSuccessBody")}
          </p>
        </div>
        <Link
          className="inline-flex w-full items-center justify-center bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
          href="/login"
        >
          {t("continueToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {t("resetTitle")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">{t("resetSubtitle")}</p>
      </div>

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          autoComplete="new-password"
          error={errors.password?.message}
          hideLabel={t("hidePassword")}
          label={t("newPassword")}
          showLabel={t("showPassword")}
          {...register("password")}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          hideLabel={t("hidePassword")}
          label={t("confirmPassword")}
          showLabel={t("showPassword")}
          {...register("confirmPassword")}
        />
        {formError ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <Button
          className="w-full rounded-none"
          disabled={isSubmitting || !token}
          type="submit"
        >
          {isSubmitting ? t("resetSaving") : t("resetSubmit")}
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
