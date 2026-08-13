import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { profesionalEnglishPath } from "@/features/profesional/constants/profesional.constants";
import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const englishPath = profesionalEnglishPath(request.nextUrl.pathname);
  if (englishPath) {
    const url = request.nextUrl.clone();
    url.pathname = englishPath;
    return NextResponse.rewrite(url);
  }

  return handleI18n(request);
}

export const config = {
  // `cms` is excluded so the internal Editorial CMS (its own root layout, no
  // locale prefix) is not rewritten by the public-site i18n middleware.
  matcher: ["/((?!api|_next|_vercel|cms|.*\\..*).*)"],
};
