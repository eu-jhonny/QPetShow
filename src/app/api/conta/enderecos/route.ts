import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, getUserById, updateUser, type SavedAddress } from "@/lib/server/auth";

const addressSchema = z.object({
  label: z.string().trim().min(1).max(40),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().trim().min(2).max(150),
  number: z.string().trim().min(1).max(10),
  complement: z.string().trim().max(80).optional().or(z.literal("")),
  neighborhood: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().length(2),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const user = await getUserById(session.sub);
  return NextResponse.json({ addresses: user?.addresses ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const user = await getUserById(session.sub);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  const addresses = user.addresses ?? [];
  const address: SavedAddress = { id: crypto.randomUUID(), ...parsed.data, isDefault: addresses.length === 0 };
  await updateUser(session.sub, { addresses: [...addresses, address] });
  return NextResponse.json({ address }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const user = await getUserById(session.sub);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  await updateUser(session.sub, { addresses: (user.addresses ?? []).filter((a) => a.id !== id) });
  return NextResponse.json({ ok: true });
}
