import { NextResponse } from "next/server";

import { contactFormSchema } from "@/features/contact/schemas/contact.schema";
import { sendContactEmail } from "@/features/contact/server/contact-mailer";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 400 });
  }

  const { fullName, email, phone, inquiryType, message } = parsed.data;

  try {
    await sendContactEmail({ fullName, email, phone, inquiryType, message });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 },
    );
  }
}
