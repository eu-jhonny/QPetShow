import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { findUserByEmail, verifyPassword, createSessionToken, setSessionCookie } from "@/lib/server/auth";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "login"), 8, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  // Mensagem genérica para não revelar quais e-mails existem
  const invalidMessage = "E-mail ou senha incorretos";
  if (!user) {
    return NextResponse.json({ error: invalidMessage }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: invalidMessage }, { status: 401 });
  }

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
