import { z } from "zod";

export const cmsColumnEditorSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  summary: z.string().trim().max(1000).optional().or(z.literal("")),
  content: z.string().trim().min(1, "Content is required"),
  featuredImage: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Featured image must be a valid URL",
    ),
  titleEn: z.string().trim().optional().or(z.literal("")),
  summaryEn: z.string().trim().optional().or(z.literal("")),
  contentEn: z.string().trim().optional().or(z.literal("")),
  titleUz: z.string().trim().optional().or(z.literal("")),
  summaryUz: z.string().trim().optional().or(z.literal("")),
  contentUz: z.string().trim().optional().or(z.literal("")),
});

export type CmsColumnEditorValues = z.infer<typeof cmsColumnEditorSchema>;
