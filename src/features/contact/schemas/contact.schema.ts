import { z } from "zod";

import { CONTACT_INQUIRY_TYPES } from "@/features/contact/constants/contact.constants";

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(1).max(40),
  inquiryType: z.enum(CONTACT_INQUIRY_TYPES),
  message: z.string().trim().min(1).max(5000),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
