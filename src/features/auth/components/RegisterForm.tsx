"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { TextField } from "@/shared/components/ui/TextField";
import { ApiError } from "@/shared/lib/errors";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createRegisterSchema({
        fullNameRequired: t("validation.fullNameRequired"),
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      router.push(`/check-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t("errors.registerFailed");
      setFormError(message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="editorial-section-title font-serif text-2xl font-bold text-ink">
          {t("registerTitle")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">{t("registerSubtitle")}</p>
      </div>

      <GoogleLoginButton />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {t("or")}
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          autoComplete="name"
          error={errors.fullName?.message}
          label={t("fullName")}
          type="text"
          {...register("fullName")}
        />
        <TextField
          autoComplete="email"
          error={errors.email?.message}
          label={t("email")}
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="new-password"
          error={errors.password?.message}
          label={t("password")}
          type="password"
          {...register("password")}
        />
        <TextField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label={t("confirmPassword")}
          type="password"
          {...register("confirmPassword")}
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
          {isSubmitting ? t("creatingAccount") : t("createAccount")}
        </Button>
      </form>

      <p className="text-sm text-neutral-600">
        {t("haveAccount")}{" "}
        <Link className="font-semibold text-ink hover:text-accent" href="/login">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
