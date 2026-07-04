import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { getInstagramPhotos, addInstagramPhoto, deleteInstagramPhoto } from "@/lib/server/instagram";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  return NextResponse.json({ photos: await getInstagramPhotos() });
}

const schema = z.object({
  image: z.string().min(1, "Informe a imagem"),
  href: z.string().trim().min(1).default("https://instagram.com/qpetshop.oficial"),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const photo = await addInstagramPhoto(parsed.data);
  return NextResponse.json({ photo }, { status: 201 });
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await deleteInstagramPhoto(id);
  return NextResponse.json({ ok: true });
}
