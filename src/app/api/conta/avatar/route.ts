import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession, updateUser } from "@/lib/server/auth";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 4 * 1024 * 1024;

/** Upload da foto de perfil do cliente logado. */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Imagem muito grande (máx. 4MB)" }, { status: 400 });

  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${session.sub}-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "avatars");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  const url = `/avatars/${name}`;
  await updateUser(session.sub, { avatar: url });
  return NextResponse.json({ url }, { status: 201 });
}
