import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { getCatalog, upsertProduct } from "@/lib/server/catalog";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/data/products";
import type { IconKey } from "@/lib/icon-map";

const iconKeys = [
  "dog", "cat", "shield", "layers", "drumstick", "toy", "bone", "pill",
  "beef", "bed", "paw", "droplets", "bath", "sparkles", "zap", "utensils",
] as const;

const productSchema = z.object({
  name: z.string().trim().min(3).max(140),
  brand: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1),
  price: z.number().positive(),
  oldPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  description: z.string().trim().min(10).max(2000),
  features: z.array(z.string().trim()).default([]),
  icon: z.enum(iconKeys).default("paw"),
  gradient: z.string().default("from-brand-100 to-brand-300"),
  badge: z.enum(["promo", "novo", "mais-vendido"]).optional(),
  image: z.string().max(400).optional().or(z.literal("")),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
});

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const products = await getCatalog();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const d = parsed.data;
  const product: Product = {
    id: crypto.randomUUID(),
    slug: `${slugify(d.name)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: d.name,
    brand: d.brand,
    category: d.category,
    price: d.price,
    oldPrice: d.oldPrice,
    rating: d.rating ?? 5,
    reviews: d.reviews ?? 0,
    icon: d.icon as IconKey,
    gradient: d.gradient,
    badge: d.badge,
    description: d.description,
    features: d.features,
    stock: d.stock,
    image: d.image || undefined,
  };
  await upsertProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}
