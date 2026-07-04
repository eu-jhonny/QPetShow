import { getResend, isEmailEnabled } from "@/lib/resend";
import { getSettings } from "@/lib/server/settings";
import * as t from "./templates";

async function from() {
  const s = await getSettings().catch(() => null);
  return s?.emailFrom || process.env.EMAIL_FROM || "onboarding@resend.dev";
}

async function adminEmail() {
  const s = await getSettings().catch(() => null);
  return (
    s?.emailAdmin ||
    process.env.EMAIL_ADMIN ||
    process.env.ADMIN_EMAILS?.split(",")[0]?.trim() ||
    (await from())
  );
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envia um e-mail via Resend. Nunca lança: se não houver chave ou a API
 * falhar, apenas registra no log e retorna { ok:false } — o fluxo do usuário
 * (cadastro, checkout) não deve quebrar por causa de e-mail.
 */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn(`[email] desabilitado (sem RESEND_API_KEY) — não enviado: "${subject}" para ${to}`);
    return { ok: false, error: "email-disabled" };
  }
  try {
    const { error } = await resend.emails.send({ from: await from(), to, subject, html });
    if (error) {
      console.error(`[email] Resend recusou "${subject}" para ${to}:`, error);
      return { ok: false, error: String(error.message ?? error) };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[email] falha ao enviar "${subject}" para ${to}:`, err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export { isEmailEnabled };

// ---- Atalhos de alto nível (cada um monta o template e envia) ----

export function sendWelcome(to: string, name: string) {
  const c = t.welcomeEmail(name);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export function sendResetPassword(to: string, name: string, url: string) {
  const c = t.resetPasswordEmail(name, url);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export function sendNewsletterWelcome(to: string) {
  const c = t.newsletterWelcomeEmail();
  return sendEmail({ to, subject: c.subject, html: c.html });
}

type OrderLite = Parameters<typeof t.orderConfirmationEmail>[0];

export async function sendOrderConfirmation(to: string, order: OrderLite) {
  const c = t.orderConfirmationEmail(order);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export async function sendPaymentApproved(to: string, order: OrderLite) {
  const c = t.paymentApprovedEmail(order);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export async function sendPaymentDeclined(to: string, order: OrderLite) {
  const c = t.paymentDeclinedEmail(order);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export async function sendOrderShipped(to: string, order: OrderLite, tracking: string) {
  const c = t.orderShippedEmail(order, tracking);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export async function notifyAdminNewOrder(order: OrderLite) {
  const c = t.adminNewOrderEmail(order);
  return sendEmail({ to: await adminEmail(), subject: c.subject, html: c.html });
}

export function sendContactAck(to: string, name: string) {
  const c = t.contactAckEmail(name);
  return sendEmail({ to, subject: c.subject, html: c.html });
}

export async function notifyAdminContact(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const c = t.adminContactEmail(data);
  return sendEmail({ to: await adminEmail(), subject: c.subject, html: c.html });
}
