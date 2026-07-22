import { z } from "zod";

export function createLoginSchema(messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}) {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(messages: {
  fullNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordMin: string;
  confirmRequired: string;
  passwordMismatch: string;
}) {
  return z
    .object({
      fullName: z.string().min(1, messages.fullNameRequired),
      email: z
        .string()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      password: z.string().min(8, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

export function createForgotPasswordSchema(messages: {
  emailRequired: string;
  emailInvalid: string;
}) {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function createResetPasswordSchema(messages: {
  passwordMin: string;
  confirmRequired: string;
  passwordMismatch: string;
}) {
  return z
    .object({
      password: z.string().min(8, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
