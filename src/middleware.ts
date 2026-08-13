import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

import { profesionalLocaleResponse } from "@/features/profesional/lib/profesional-locale";
import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return profesionalLocaleResponse(request) ?? handleI18n(request);
}

export const config = {
  // `cms` is excluded so the internal Editorial CMS (its own root layout, no
  // locale prefix) is not rewritten by the public-site i18n middleware.
  matcher: ["/((?!api|_next|_vercel|cms|.*\\..*).*)"],
};
