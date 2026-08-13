import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";

export async function profesionalPageMeta(
  _locale: string,
  titleKey: string,
  descriptionKey: string,
): Promise<Metadata> {
  const t = await getTranslations({
    locale: PROFESIONAL_LOCALE,
    namespace: "profesional",
  });

  return {
    title: t(titleKey),
    description: t(descriptionKey),
  };
}
