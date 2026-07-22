import { z } from "zod";

interface ColumnSchemaMessages {
  titleRequired: string;
  contentRequired: string;
  featuredImageInvalid: string;
}

export function createColumnFormSchema(messages: ColumnSchemaMessages) {
  return z.object({
    title: z.string().trim().min(1, messages.titleRequired).max(255),
    summary: z.string().trim().max(1000).optional().or(z.literal("")),
    content: z.string().trim().min(1, messages.contentRequired),
    featuredImage: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => !value || /^https?:\/\//i.test(value),
        messages.featuredImageInvalid,
      ),
    titleEn: z.string().trim().optional().or(z.literal("")),
    summaryEn: z.string().trim().optional().or(z.literal("")),
    contentEn: z.string().trim().optional().or(z.literal("")),
    titleUz: z.string().trim().optional().or(z.literal("")),
    summaryUz: z.string().trim().optional().or(z.literal("")),
    contentUz: z.string().trim().optional().or(z.literal("")),
  });
}

export type ColumnFormValues = z.infer<
  ReturnType<typeof createColumnFormSchema>
>;
