import { z } from "zod";
export const mediaCatalogSchema = z.object({
  name: z.string().trim().min(1).max(150),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(150),
  description: z.string().max(2000),
  poster_url: z
    .string()
    .trim()
    .url()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Use an HTTP or HTTPS image URL",
    ),
  format: z.enum(["horizontal", "short"]),
  sort_order: z.number().int().min(0).max(9999),
  is_active: z.boolean(),
  video_ids: z.array(z.string().uuid()).max(100),
  nameEn: z.string().max(150),
  descriptionEn: z.string().max(2000),
  nameUz: z.string().max(150),
  descriptionUz: z.string().max(2000),
});
export type MediaCatalogValues = z.infer<typeof mediaCatalogSchema>;
export const EMPTY_MEDIA_CATALOG: MediaCatalogValues = {
  name: "",
  slug: "",
  description: "",
  poster_url: "",
  format: "horizontal",
  sort_order: 0,
  is_active: false,
  video_ids: [],
  nameEn: "",
  descriptionEn: "",
  nameUz: "",
  descriptionUz: "",
};
