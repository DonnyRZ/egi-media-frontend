"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import {
  createUpdateNameSchema,
  type UpdateNameFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { updateCurrentUserName } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { TextField } from "@/shared/components/ui/TextField";
import { ApiError } from "@/shared/lib/errors";

export function ProfileNameForm() {
  const t = useTranslations("profilePage");
  const tAuth = useTranslations("auth");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      createUpdateNameSchema({
        fullNameRequired: tAuth("validation.fullNameRequired"),
      }),
    [tAuth],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.fullName ?? "" },
  });

  useEffect(() => {
    reset({ fullName: user?.fullName ?? "" });
  }, [user?.fullName, reset]);

  async function onSubmit(values: UpdateNameFormValues) {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateCurrentUserName(values.fullName.trim());
      setUser(updated);
      reset({ fullName: updated.fullName });
      setSuccessMessage(t("nameSuccess"));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t("errors.nameFailed");
      setFormError(message);
    }
  }

  return (
    <section className="border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="editorial-section-title font-serif text-xl font-bold text-ink">
          {t("nameHeading")}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">{t("nameLede")}</p>
      </div>

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          autoComplete="email"
          disabled
          label={t("emailLabel")}
          readOnly
          type="email"
          value={user?.email ?? ""}
        />
        <TextField
          autoComplete="name"
          error={errors.fullName?.message}
          label={t("fullNameLabel")}
          type="text"
          {...register("fullName")}
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

        <Button
          className="rounded-none"
          disabled={isSubmitting || !isDirty}
          type="submit"
        >
          {isSubmitting ? t("saving") : t("saveName")}
        </Button>
      </form>
    </section>
  );
}
