import { Resend } from "resend";

let resend: Resend | null = null;

export function getResend(): Resend {
  if (!process.env.EMAIL_API_KEY) {
    throw new Error("EMAIL_API_KEY não configurada.");
  }

  if (!resend) {
    resend = new Resend(process.env.EMAIL_API_KEY);
  }

  return resend;
}
