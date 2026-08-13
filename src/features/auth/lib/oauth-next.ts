import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { PROFESIONAL_PATH } from "@/features/profesional/constants/profesional.constants";
import { env } from "@/shared/config/env";

export function safeOAuthNext(value: string | null | undefined): string {
  const next = String(value ?? "").trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return "";
  }

  const path = next.split("?")[0].split("#")[0];
  if (path !== PROFESIONAL_PATH && !path.startsWith(`${PROFESIONAL_PATH}/`)) {
    return "";
  }

  return path;
}

export function googleOAuthStartUrl(locale: string, next?: string): string {
  const apiBase = env.apiUrl.replace(/\/$/, "");
  const siteBase = env.siteUrl.replace(/\/$/, "");
  const origin = `${siteBase}/${locale}`;
  const url = new URL(`${apiBase}${AUTH_ENDPOINTS.google}`);
  url.searchParams.set("origin", origin);
  const safeNext = safeOAuthNext(next);
  if (safeNext) {
    url.searchParams.set("next", safeNext);
  }

  return url.toString();
}
