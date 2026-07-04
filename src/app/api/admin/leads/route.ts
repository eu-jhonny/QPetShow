import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { readCollection, writeCollection } from "@/lib/server/store";

interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  status?: "novo" | "contatado" | "convertido";
  consent: boolean;
  createdAt: string;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const leads = (await readCollection<Lead>("leads")).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ leads });
}

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(["novo", "contatado", "convertido"]),
});

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const leads = await readCollection<Lead>("leads");
  const idx = leads.findIndex((l) => l.id === parsed.data.id);
  if (idx === -1) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  leads[idx].status = parsed.data.status;
  await writeCollection("leads", leads);
  return NextResponse.json({ lead: leads[idx] });
}
