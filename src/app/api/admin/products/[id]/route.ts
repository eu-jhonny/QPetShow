import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { getCatalog, upsertProduct, deleteProduct } from "@/lib/server/catalog";

const iconKeys = [
  "dog", "cat", "shield", "layers", "drumstick", "toy", "bone", "pill",
  "beef", "bed", "paw", "droplets", "bath", "sparkles", "zap", "utensils",
] as const;

const patchSchema = z.object({
  name: z.string().trim().min(3).max(140).optional(),
  brand: z.string().trim().min(1).max(60).optional(),
  category: z.string().trim().min(1).optional(),
  price: z.number().positive().optional(),
  oldPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  badge: z.enum(["promo", "novo", "mais-vendido"]).nullable().optional(),
  image: z.string().max(400).nullable().optional(),
  icon: z.enum(iconKeys).optional(),
  features: z.array(z.string().trim().max(80)).max(12).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const all = await getCatalog();
  const current = all.find((p) => p.id === id);
  if (!current) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

  const d = parsed.data;
  const updated = {
    ...current,
    ...(d.name !== undefined && { name: d.name }),
    ...(d.brand !== undefined && { brand: d.brand }),
    ...(d.category !== undefined && { category: d.category }),
    ...(d.price !== undefined && { price: d.price }),
    ...(d.oldPrice !== undefined && { oldPrice: d.oldPrice ?? undefined }),
    ...(d.stock !== undefined && { stock: d.stock }),
    ...(d.description !== undefined && { description: d.description }),
    ...(d.badge !== undefined && { badge: d.badge ?? undefined }),
    ...(d.image !== undefined && { image: d.image ?? undefined }),
    ...(d.icon !== undefined && { icon: d.icon }),
    ...(d.features !== undefined && { features: d.features }),
    ...(d.rating !== undefined && { rating: d.rating }),
    ...(d.reviews !== undefined && { reviews: d.reviews }),
  };
  await upsertProduct(updated);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
