"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { changePassword } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { PasswordField } from "@/shared/components/ui/PasswordField";
import { ApiError } from "@/shared/lib/errors";

export function ProfilePasswordForm() {
  const t = useTranslations("profilePage");
  const tAuth = useTranslations("auth");
  const loginProvider = useAuthStore((state) => state.user?.loginProvider);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createChangePasswordSchema({
        oldPasswordRequired: t("validation.oldPasswordRequired"),
        passwordMin: tAuth("validation.passwordMin"),
        confirmRequired: tAuth("validation.confirmRequired"),
        passwordMismatch: tAuth("validation.passwordMismatch"),
      }),
    [t, tAuth],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (loginProvider && loginProvider !== "email") {
    return (
      <section className="border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="editorial-section-title font-serif text-xl font-bold text-ink">
            {t("passwordHeading")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{t("passwordSocialNote")}</p>
        </div>
      </section>
    );
  }

  async function onSubmit(values: ChangePasswordFormValues) {
    setFormError(null);
    setSuccessMessage(null);
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      reset();
      setSuccessMessage(t("passwordSuccess"));
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t("errors.passwordFailed");
      setFormError(message);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="editorial-section-title font-serif text-xl font-bold text-ink">
          {t("passwordHeading")}
        </h2>
      </div>

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordField
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          hideLabel={t("hidePassword")}
          label={t("oldPassword")}
          showLabel={t("showPassword")}
          {...register("oldPassword")}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.newPassword?.message}
          hideLabel={t("hidePassword")}
          label={t("newPassword")}
          showLabel={t("showPassword")}
          {...register("newPassword")}
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
        {successMessage ? (
          <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {successMessage}
          </p>
        ) : null}

        <Button className="rounded-none" disabled={isSubmitting} type="submit">
          {isSubmitting ? t("saving") : t("savePassword")}
        </Button>
      </form>
    </section>
  );
}
