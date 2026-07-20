"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { resendVerificationEmail } from "@/features/auth/services/auth.service";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { ApiError } from "@/shared/lib/errors";

export function CheckEmailView() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleResend() {
    if (!email) return;
    setStatus("sending");
    setMessage(null);
    try {
      const result = await resendVerificationEmail(email);
      setStatus("sent");
      setMessage(result);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof ApiError ? error.message : t("errors.resendFailed"),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">
          {t("checkEmailTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {t("checkEmailBody", { email: email || t("yourEmail") })}
        </p>
      </div>

      {message ? (
        <p
          className={
            status === "error"
              ? "border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              : "border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          }
        >
          {message}
        </p>
      ) : null}

      <div className="space-y-3">
        <Button
          className="w-full rounded-none"
          disabled={!email || status === "sending"}
          onClick={() => void handleResend()}
          type="button"
          variant="secondary"
        >
          {status === "sending" ? t("resending") : t("resendVerification")}
        </Button>
        <Link
          className="inline-flex w-full items-center justify-center border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-neutral-50"
          href="/login"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}
