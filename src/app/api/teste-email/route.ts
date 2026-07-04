import { NextResponse } from "next/server";
import { sendEmail, isEmailEnabled } from "@/lib/email";

/**
 * Rota de diagnóstico: GET /api/teste-email?to=seu@email.com
 * Envia um e-mail de teste para verificar a configuração do Resend.
 */
export async function GET(request: Request) {
  if (!isEmailEnabled()) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY não configurada no .env" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to") ?? process.env.EMAIL_ADMIN ?? "";
  if (!to) {
    return NextResponse.json({ ok: false, error: "Informe ?to=email" }, { status: 400 });
  }

  const result = await sendEmail({
    to,
    subject: "Teste de e-mail — QPet Shop",
    html: `<div style="font-family:sans-serif;padding:24px">
      <h1 style="color:#4caf2e">Funcionou! 🎉</h1>
      <p>O envio de e-mails da QPet Shop está configurado corretamente.</p>
    </div>`,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
