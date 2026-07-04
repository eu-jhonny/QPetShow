import { sendResetPassword } from "@/lib/email";

/** Compat: delega para o serviço central de e-mail. */
export async function sendResetPasswordEmail(email: string, token: string, name = "cliente") {
  const base = process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${base}/recuperar-senha/redefinir?token=${token}`;
  return sendResetPassword(email, name, url);
}
