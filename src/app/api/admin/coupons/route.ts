import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { listCoupons, saveCoupons, type Coupon } from "@/lib/server/coupons";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

const createSchema = z.object({
  code: z.string().trim().min(3).max(30),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  minSubtotal: z.number().min(0).optional(),
});

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const coupons = await listCoupons();
  const code = parsed.data.code.toUpperCase();
  if (coupons.some((c) => c.code === code)) {
    return NextResponse.json({ error: "Já existe um cupom com esse código" }, { status: 409 });
  }
  const coupon: Coupon = {
    code,
    type: parsed.data.type,
    value: parsed.data.value,
    minSubtotal: parsed.data.minSubtotal,
    active: true,
    createdAt: new Date().toISOString(),
  };
  await saveCoupons([...coupons, coupon]);
  return NextResponse.json({ coupon }, { status: 201 });
}

const patchSchema = z.object({ code: z.string(), active: z.boolean().optional(), remove: z.boolean().optional() });

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  let coupons = await listCoupons();
  if (parsed.data.remove) {
    coupons = coupons.filter((c) => c.code !== parsed.data.code);
  } else {
    coupons = coupons.map((c) => (c.code === parsed.data.code ? { ...c, active: parsed.data.active ?? c.active } : c));
  }
  await saveCoupons(coupons);
  return NextResponse.json({ coupons });
}
