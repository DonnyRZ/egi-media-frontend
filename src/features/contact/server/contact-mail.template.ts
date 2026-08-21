import { CONTACT_INQUIRY_LABELS } from "@/features/contact/constants/contact.constants";
import type { ContactFormPayload } from "@/features/contact/schemas/contact.schema";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatReceivedAt(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;width:140px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6B7280;font-weight:700;">
        ${label}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;vertical-align:top;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.5;color:#111827;">
        ${value}
      </td>
    </tr>
  `;
}

export function buildContactEmail(payload: ContactFormPayload) {
  const inquiryLabel = CONTACT_INQUIRY_LABELS[payload.inquiryType];

  return {
    subject: `Web EGI Media — ${inquiryLabel} — ${payload.fullName}`,
    html: buildContactEmailHtml(payload, inquiryLabel),
    replyTo: payload.email,
  };
}

function buildContactEmailHtml(
  payload: ContactFormPayload,
  inquiryLabel: string,
): string {
  const name = escapeHtml(payload.fullName);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone);
  const type = escapeHtml(inquiryLabel);
  const message = escapeHtml(payload.message).replaceAll("\n", "<br />");
  const receivedAt = formatReceivedAt();

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F3F4F6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #D1D5DB;">
            <tr>
              <td style="background:#111827;padding:20px 28px;border-bottom:3px solid #2B5AA0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;color:#ffffff;font-weight:700;">
                EGI MEDIA
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 20px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#2B5AA0;font-weight:700;">
                  New Inquiry
                </p>
                <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#111827;font-weight:700;">
                  ${type}
                </h1>
                <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">
                  Received ${receivedAt}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px;">
                <div style="border-top:1px solid #D1D5DB;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">
                <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6B7280;font-weight:700;">
                  Correspondent
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow("Full Name", name)}
                  ${fieldRow("Email", email)}
                  ${fieldRow("Phone", phone)}
                  ${fieldRow("Inquiry Type", type)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 32px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6B7280;font-weight:700;">
                  Message
                </p>
                <div style="border-left:3px solid #183E7A;background:#F9FAFB;padding:16px 20px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#111827;">
                  ${message}
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#111827;padding:16px 28px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3AF;">
                  Confidential — For internal distribution only
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
