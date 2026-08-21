import nodemailer from "nodemailer";

import type { ContactFormPayload } from "@/features/contact/schemas/contact.schema";
import { getContactMailConfig } from "@/features/contact/server/contact-mail.config";
import { buildContactEmail } from "@/features/contact/server/contact-mail.template";

export async function sendContactEmail(
  payload: ContactFormPayload,
): Promise<void> {
  const config = getContactMailConfig();

  if (!config) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS");
  }

  const email = buildContactEmail(payload);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.user,
    to: config.to,
    replyTo: email.replyTo,
    subject: email.subject,
    html: email.html,
  });
}
