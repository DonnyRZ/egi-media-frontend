import { NextRequest, NextResponse } from "next/server";

import {
  PROFESIONAL_LOCALE,
  profesionalEnglishPath,
} from "@/features/profesional/constants/profesional.constants";

function isLoopbackHost(host: string) {
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
}

function firstHeader(headers: Headers, name: string) {
  return headers.get(name)?.split(",")[0]?.trim() || "";
}

function publicOrigin(request: NextRequest) {
  const forwardedHost = firstHeader(request.headers, "x-forwarded-host");
  if (forwardedHost && !isLoopbackHost(forwardedHost)) {
    const proto = firstHeader(request.headers, "x-forwarded-proto") || "https";
    return `${proto}://${forwardedHost}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;

  try {
    const origin = new URL(siteUrl).origin;
    return isLoopbackHost(new URL(origin).host) ? null : origin;
  } catch {
    return null;
  }
}

export function profesionalLocaleResponse(request: NextRequest) {
  const englishPath = profesionalEnglishPath(request.nextUrl.pathname);
  if (!englishPath) return null;

  const origin = publicOrigin(request);
  if (origin) {
    const target = new URL(englishPath, origin);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target);
  }

  const url = new URL(request.url);
  url.protocol = "http:";
  url.pathname = englishPath;
  const headers = new Headers(request.headers);
  headers.set("X-NEXT-INTL-LOCALE", PROFESIONAL_LOCALE);
  return NextResponse.rewrite(url, { request: { headers } });
}
