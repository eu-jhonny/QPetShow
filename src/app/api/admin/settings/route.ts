import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/server/auth";
import { getSettings, saveSettings } from "@/lib/server/settings";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  return NextResponse.json({ settings: await getSettings() });
}

const schema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  slogan: z.string().trim().max(80).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().max(160).optional(),
  instagram: z.string().trim().max(60).optional(),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  freeShippingMin: z.number().min(0).optional(),
  emailFrom: z.string().trim().max(120).optional(),
  emailAdmin: z.string().trim().max(120).optional(),
});

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const settings = await saveSettings(parsed.data);
  return NextResponse.json({ settings });
}
