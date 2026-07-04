import { getResend } from "@/lib/resend";
import { getSettings } from "@/lib/server/settings";
import * as t from "./templates";

const BREVO = () => process.env.BREVO_API_KEY ?? "";
const RESEND = () => process.env.RESEND_API_KEY ?? process.env.EMAIL_API_KEY ?? "";

/** Há algum provedor de e-mail configurado? */
export function isEmailEnabled() {
  return BREVO().length > 0 || RESEND().length > 0;
}

async function from() {
  const s = await getSettings().catch(() => null);
  return s?.emailFrom || process.env.EMAIL_FROM || "onboarding@resend.dev";
}

function fromName() {
  return process.env.EMAIL_FROM_NAME || "QPet Shop";
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

/** Envio via Brevo (transacional). O remetente precisa estar verificado na conta. */
async function sendViaBrevo(fromEmail: string, { to, subject, html }: SendArgs) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO(),
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName() },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (res.ok) return { ok: true as const };
  const data = await res.json().catch(() => ({}));
  const msg = (data as { message?: string }).message ?? `HTTP ${res.status}`;
  console.error(`[email] Brevo recusou "${subject}" para ${to}:`, msg);
  return { ok: false as const, error: msg };
}

/**
 * Envia um e-mail. Usa Brevo se BREVO_API_KEY estiver definida, senão Resend.
 * Nunca lança: em caso de falha, registra no log e retorna { ok:false } — o
 * fluxo do usuário (cadastro, checkout) não quebra por causa de e-mail.
 */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const fromEmail = await from();

  try {
    if (BREVO()) {
      return await sendViaBrevo(fromEmail, { to, subject, html });
    }
    const resend = getResend();
    if (!resend) {
      console.warn(`[email] desabilitado (sem provedor) — não enviado: "${subject}" para ${to}`);
      return { ok: false, error: "email-disabled" };
    }
    const { error } = await resend.emails.send({ from: fromEmail, to, subject, html });
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
