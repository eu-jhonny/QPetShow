import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { appendToCollection } from "@/lib/server/store";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";
import { sendContactAck, notifyAdminContact } from "@/lib/email";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "contato"), 3, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const message = {
    id: crypto.randomUUID(),
    ...parsed.data,
    status: "aberta" as const,
    createdAt: new Date().toISOString(),
  };
  await appendToCollection("messages", message);

  // avisa o admin e confirma o recebimento ao cliente (não bloqueia a resposta)
  try {
    await Promise.all([
      notifyAdminContact(parsed.data),
      sendContactAck(parsed.data.email, parsed.data.name),
    ]);
  } catch (error) {
    console.error("Erro ao enviar e-mails de contato:", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
