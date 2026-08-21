export interface ContactMailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
}

export function getContactMailConfig(): ContactMailConfig | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    user,
    pass,
    to: process.env.EMAIL_TO ?? "egi.egimedia@gmail.com",
  };
}
