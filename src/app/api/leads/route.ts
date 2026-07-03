import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators";
import { readCollection, writeCollection } from "@/lib/server/store";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";

interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  consent: boolean;
  createdAt: string;
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "leads"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const leads = await readCollection<Lead>("leads");
  const email = parsed.data.email.toLowerCase();

  if (leads.some((l) => l.email === email)) {
    return NextResponse.json({ ok: true, message: "E-mail já cadastrado" });
  }

  leads.push({
    id: crypto.randomUUID(),
    email,
    name: parsed.data.name,
    source: parsed.data.source,
    consent: parsed.data.consent,
    createdAt: new Date().toISOString(),
  });
  await writeCollection("leads", leads);

  // Aqui entra a integração com CRM/e-mail marketing (RD Station, Mailchimp, Brevo...)
  // e o disparo do e-mail de boas-vindas com o cupom (template /emails/newsletter-boas-vindas.html)

  return NextResponse.json({ ok: true }, { status: 201 });
}
