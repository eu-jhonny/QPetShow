import { Resend } from "resend";

let resend: Resend | null = null;

/** Aceita RESEND_API_KEY (novo) ou EMAIL_API_KEY (legado). */
function apiKey() {
  return process.env.RESEND_API_KEY ?? process.env.EMAIL_API_KEY ?? "";
}

export function isEmailEnabled() {
  return apiKey().length > 0;
}

/** Retorna o client ou null se não houver chave configurada (evita quebrar em dev). */
export function getResend(): Resend | null {
  if (!isEmailEnabled()) return null;
  if (!resend) resend = new Resend(apiKey());
  return resend;
}
