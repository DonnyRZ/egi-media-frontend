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
});

export type CmsColumnEditorValues = z.infer<typeof cmsColumnEditorSchema>;
