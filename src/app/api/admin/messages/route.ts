import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { readCollection, writeCollection } from "@/lib/server/store";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: "aberta" | "respondida";
  createdAt: string;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const messages = (await readCollection<Message>("messages")).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ messages });
}

const patchSchema = z.object({ id: z.string(), status: z.enum(["aberta", "respondida"]) });

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const messages = await readCollection<Message>("messages");
  const idx = messages.findIndex((m) => m.id === parsed.data.id);
  if (idx === -1) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  messages[idx].status = parsed.data.status;
  await writeCollection("messages", messages);
  return NextResponse.json({ message: messages[idx] });
}
