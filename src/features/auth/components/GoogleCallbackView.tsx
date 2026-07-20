"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthSuccessDialog } from "@/features/auth/components/AuthSuccessDialog";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useRouter } from "@/i18n/navigation";

export function GoogleCallbackView() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const goHome = useCallback(() => {
    router.replace("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const expiresIn = Number(searchParams.get("expires_in") || 300);

    if (!accessToken || !refreshToken) {
      setError(t("errors.googleFailed"));
      return;
    }

    void (async () => {
      try {
        await setSession({
          accessToken,
          refreshToken,
          tokenType: "Bearer",
          expiresIn,
        });
        setShowSuccess(true);
      } catch {
        setError(t("errors.googleFailed"));
      }
    })();
  }, [searchParams, setSession, t]);

  return (
    <>
      <div className="space-y-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-ink">
          {error ? t("googleFailedTitle") : t("googleLoadingTitle")}
        </h2>
        <p className="text-sm text-neutral-600">
          {error ?? t("googleLoadingBody")}
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
