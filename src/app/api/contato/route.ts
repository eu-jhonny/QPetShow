import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { appendToCollection } from "@/lib/server/store";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";

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

  await appendToCollection("messages", {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
