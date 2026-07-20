"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { verifyEmailToken } from "@/features/auth/services/auth.service";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/shared/lib/errors";

export function VerifyEmailView() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setStatus("error");
        setMessage(t("errors.missingToken"));
        return;
      }

      try {
        const result = await verifyEmailToken(token);
        if (cancelled) return;
        setStatus("success");
        setMessage(result || t("verifySuccess"));
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          error instanceof ApiError ? error.message : t("errors.verifyFailed"),
        );
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token, t]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {status === "loading"
            ? t("verifyingTitle")
            : status === "success"
              ? t("verifySuccessTitle")
              : t("verifyFailedTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {status === "loading" ? t("verifyingBody") : message}
        </p>
      </div>

      {status !== "loading" ? (
        <Link
          className="inline-flex w-full items-center justify-center bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
          href="/login"
        >
          {t("continueToLogin")}
        </Link>
      ) : null}
    </div>
  );
}
