import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .or(z.literal(""))
  .optional();

export const articleFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  summary: z.string().trim().max(500, "Summary is too long").optional(),
  content: z
    .string()
    .refine((value) => value.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "Content is required",
    }),
  // Optional English translation. Title + content must be filled together.
  titleEn: z.string().trim().max(255).optional(),
  summaryEn: z.string().trim().max(500).optional(),
  contentEn: z.string().optional(),
  // Optional Uzbek translation.
  titleUz: z.string().trim().max(255).optional(),
  summaryUz: z.string().trim().max(500).optional(),
  contentUz: z.string().optional(),
  featuredImage: optionalUrl,
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
  topicIds: z.array(z.string()),
  tagIds: z.array(z.string()),
  placements: z.array(
    z.enum(["latest_news", "homepage_hero", "headline", "trending"]),
  ),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

function isFilledHtml(value: string | undefined): boolean {
  return Boolean(value?.replace(/<[^>]*>/g, "").trim());
}

/**
 * Strict multilanguage check for publish / review / schedule.
 * Draft saves may remain partial; these actions require ID + EN + UZ title & content.
 */
export function getMissingTranslationErrors(
  values: ArticleFormValues,
): Partial<Record<keyof ArticleFormValues, string>> {
  const errors: Partial<Record<keyof ArticleFormValues, string>> = {};
  if (!values.title.trim()) {
    errors.title = "Indonesian title is required";
  }
  if (!isFilledHtml(values.content)) {
    errors.content = "Indonesian content is required";
  }
  if (!values.titleEn?.trim()) {
    errors.titleEn = "English title is required";
  }
  if (!isFilledHtml(values.contentEn)) {
    errors.contentEn = "English content is required";
  }
  if (!values.titleUz?.trim()) {
    errors.titleUz = "Oʻzbekcha title is required";
  }
  if (!isFilledHtml(values.contentUz)) {
    errors.contentUz = "Oʻzbekcha content is required";
  }
  return errors;
}

export const taxonomyFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  description: z.string().trim().max(1000).optional(),
});

export type TaxonomyFormValues = z.infer<typeof taxonomyFormSchema>;

export const topicFormSchema = taxonomyFormSchema.extend({
  categoryId: z.string().uuid("Select a parent category"),
});

export type TopicFormValues = z.infer<typeof topicFormSchema>;

export const seriesFormSchema = taxonomyFormSchema.extend({
  image: optionalUrl,
  topicId: z.string().uuid("Select a parent topic"),
});

export type SeriesFormValues = z.infer<typeof seriesFormSchema>;

export const tagFormSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required").max(100),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

export const addAuthorSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(150),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["author", "superadmin"]),
});

export type AddAuthorValues = z.infer<typeof addAuthorSchema>;

export const editUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(150),
  role: z.enum(["superadmin", "author", "member", "visitor"]),
});

export type EditUserValues = z.infer<typeof editUserSchema>;

export const profileFormSchema = z.object({
  jobTitle: z.string().trim().max(150).optional(),
  company: z.string().trim().max(150).optional(),
  industry: z.string().trim().max(150).optional(),
  seniority: z.string().trim().max(150).optional(),
  country: z.string().trim().max(150).optional(),
  bio: z.string().trim().max(1000).optional(),
  avatarUrl: optionalUrl,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const videoFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(2000).optional(),
  url: z
    .string()
    .trim()
    .min(1, "YouTube URL is required")
    .url("Enter a valid YouTube URL")
    .refine(
      (value) =>
        /youtu\.be\//.test(value) || /youtube\.com\//.test(value),
      "Enter a YouTube URL",
    ),
  isActive: z.boolean(),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;
