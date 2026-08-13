import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function profesionalPageMeta(
  locale: string,
  titleKey: string,
  descriptionKey: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "profesional" });

  return {
    title: t(titleKey),
    description: t(descriptionKey),
  };
}
