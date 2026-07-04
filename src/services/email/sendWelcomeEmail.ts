import { sendWelcome } from "@/lib/email";

/** Compat: delega para o serviço central de e-mail (templates + fallback seguro). */
export async function sendWelcomeEmail(name: string, email: string) {
  return sendWelcome(email, name);
}
