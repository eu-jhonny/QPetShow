import { Resend } from "resend";

if (!process.env.EMAIL_API_KEY) {
  throw new Error("EMAIL_API_KEY não configurada.");
}

export const resend = new Resend(process.env.EMAIL_API_KEY);