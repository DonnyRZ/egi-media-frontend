import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // `cms` is excluded so the internal Editorial CMS (its own root layout, no
  // locale prefix) is not rewritten by the public-site i18n middleware.
  matcher: ["/((?!api|_next|_vercel|cms|.*\\..*).*)"],
};
