"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adFormSchema, type AdFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsAd } from "@/features/cms/services/cms-ads.service";
export function useAdForm(ad: CmsAd | null, open: boolean) {
  const form = useForm<AdFormValues>({ resolver: zodResolver(adFormSchema), defaultValues: {
    title: "", imageUrl: "", targetUrl: "", placement: "IN_FEED", isActive: false, imageReceipt: null,
  } });
  const { reset } = form;
  useEffect(() => {
    if (open && ad) reset({ title: ad.title, imageUrl: ad.imageUrl, targetUrl: ad.targetUrl ?? "",
      placement: ad.placement, isActive: ad.isActive, imageReceipt: ad.imageReceipt });
  }, [ad, open, reset]);
  return form;
}
