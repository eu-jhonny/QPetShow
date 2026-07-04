import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getAdminSession } from "@/lib/server/auth";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Upload de imagem para /public/banners (ou subpasta via ?folder=).
 * Funciona em desenvolvimento. Em produção (Vercel), o sistema de arquivos é
 * efêmero — use Cloudinary (ver GUIA-PRODUCAO.md) e cole a URL no lugar.
 */
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Formato inválido (use PNG, JPG, WEBP...)" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Imagem muito grande (máx. 8MB)" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const folder = (searchParams.get("folder") ?? "banners").replace(/[^a-z0-9-]/gi, "");
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const dir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ url: `/${folder}/${name}` }, { status: 201 });
}
