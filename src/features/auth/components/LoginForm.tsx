"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthSuccessDialog } from "@/features/auth/components/AuthSuccessDialog";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { TextField } from "@/shared/components/ui/TextField";
import { ApiError } from "@/shared/lib/errors";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const googleError = searchParams.get("error");
  const [formError, setFormError] = useState<string | null>(
    googleError ? t("errors.googleFailed") : null,
  );
  const [showSuccess, setShowSuccess] = useState(false);
  // Prevent race: zustand auth update must not redirect before the success dialog.
  const holdOnLoginPageRef = useRef(false);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        passwordRequired: t("validation.passwordRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const goHome = useCallback(() => {
    holdOnLoginPageRef.current = false;
    setShowSuccess(false);
    router.replace("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (
      isHydrated &&
      isAuthenticated &&
      !showSuccess &&
      !holdOnLoginPageRef.current
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, isHydrated, router, showSuccess]);

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    holdOnLoginPageRef.current = true;
    try {
      await login(values);
      setShowSuccess(true);
    } catch (error) {
      holdOnLoginPageRef.current = false;
      const message =
        error instanceof ApiError ? error.message : t("errors.loginFailed");
      setFormError(message);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="editorial-section-title font-serif text-2xl font-bold text-ink">{t("loginTitle")}</h2>
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
            autoComplete="email"
            error={errors.email?.message}
            label={t("email")}
            type="email"
            {...register("email")}
          />
          <TextField
            autoComplete="current-password"
            error={errors.password?.message}
            label={t("password")}
            type="password"
            {...register("password")}
          />

          <div className="-mt-1 flex justify-end">
            <Link
              className="text-xs font-semibold text-neutral-600 hover:text-accent"
              href="/forgot-password"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          {formError ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          ) : null}

          <Button
            className="w-full rounded-none"
            disabled={isSubmitting || showSuccess}
            type="submit"
          >
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>

        <p className="text-sm text-neutral-600">
          {t("noAccount")}{" "}
          <Link className="font-semibold text-ink hover:text-accent" href="/register">
            {t("createAccount")}
          </Link>
        </p>
      </div>

      <AuthSuccessDialog
        body={t("loginSuccessBody")}
        confirmLabel={t("continueToHome")}
        onContinue={goHome}
        open={showSuccess}
        title={t("loginSuccessTitle")}
      />
    </>
  );
}
