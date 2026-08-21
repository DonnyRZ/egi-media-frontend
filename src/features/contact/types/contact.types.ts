import type { ContactInquiryType } from "@/features/contact/constants/contact.constants";

export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: ContactInquiryType;
  message: string;
}

export type ContactFormStatus = "idle" | "submitting" | "success" | "error";
