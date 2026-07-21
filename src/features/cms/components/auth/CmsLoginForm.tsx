"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/features/cms/components/ui/Button";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import {
  CMS_ALLOWED_ROLES,
  CMS_BASE_PATH,
} from "@/features/cms/constants/cms.constants";
import type { CmsRole } from "@/features/cms/types/cms.types";
import { ApiError } from "@/shared/lib/errors";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function CmsLoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      const role = useAuthStore.getState().user?.role as CmsRole | undefined;
      if (role && CMS_ALLOWED_ROLES.includes(role)) {
        router.replace(CMS_BASE_PATH);
      }
    }
  }, [isHydrated, isAuthenticated, router]);

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      await login(values);
      const role = useAuthStore.getState().user?.role as CmsRole | undefined;
      if (!role || !CMS_ALLOWED_ROLES.includes(role)) {
        await logout();
        setFormError("This account does not have editorial access.");
        return;
      }
      router.replace(CMS_BASE_PATH);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to sign in.";
      setFormError(message);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@egimedia.com"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>

      {formError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <Button className="w-full" type="submit" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
