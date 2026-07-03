import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validators";
import { findUserByEmail } from "@/lib/server/auth";
import { appendToCollection } from "@/lib/server/store";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";

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
    // Aqui entra o envio real do e-mail (template em /emails/recuperacao-senha.html)
    // com token de uso único e expiração curta.
    await appendToCollection("password-resets", {
      userId: user.id,
      token: crypto.randomUUID(),
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
  }

  // Resposta idêntica exista ou não o e-mail — evita enumeração de contas
  return NextResponse.json({ ok: true });
}
