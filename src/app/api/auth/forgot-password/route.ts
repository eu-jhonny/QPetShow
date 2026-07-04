import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validators";
import { findUserByEmail } from "@/lib/server/auth";
import { appendToCollection } from "@/lib/server/store";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";
import { sendResetPasswordEmail } from "@/services/email/sendResetPasswordEmail";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "forgot"), 3, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const user = await findUserByEmail(parsed.data.email);
  if (user) {
    const token = crypto.randomUUID();
    await appendToCollection("password-resets", {
      userId: user.id,
      token,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    try {
      await sendResetPasswordEmail(user.email, token, user.name);
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
    }
  }

  // Resposta idêntica exista ou não o e-mail — evita enumeração de contas
  return NextResponse.json({ ok: true });
}
