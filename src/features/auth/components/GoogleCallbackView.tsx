"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthSuccessDialog } from "@/features/auth/components/AuthSuccessDialog";
import { safeOAuthNext } from "@/features/auth/lib/oauth-next";
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
    const next = safeOAuthNext(searchParams.get("next"));
    router.replace(next || "/");
    router.refresh();
  }, [router, searchParams]);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const expiresParam = searchParams.get("expires_in");
    const expiresIn = Number(expiresParam);
    const resolvedExpiresIn =
      Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 7 * 24 * 60 * 60;

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
          expiresIn: resolvedExpiresIn,
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
