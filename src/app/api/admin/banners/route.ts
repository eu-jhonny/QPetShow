import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { getBanners, addBanner, updateBanner, deleteBanner } from "@/lib/server/banners";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const banners = await getBanners();
  return NextResponse.json({ banners });
}

const createSchema = z.object({
  image: z.string().min(1, "Informe a imagem"),
  alt: z.string().trim().min(2).max(140),
  href: z.string().trim().min(1).default("/produtos"),
  active: z.boolean().default(true),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const banner = await addBanner(parsed.data);
  return NextResponse.json({ banner }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  href: z.string().trim().optional(),
  alt: z.string().trim().optional(),
});

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const { id, ...patch } = parsed.data;
  const banner = await updateBanner(id, patch);
  if (!banner) return NextResponse.json({ error: "Banner não encontrado" }, { status: 404 });
  return NextResponse.json({ banner });
}

export async function DELETE(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await deleteBanner(id);
  return NextResponse.json({ ok: true });
}
