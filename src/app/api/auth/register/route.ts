import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { createUser, findUserByEmail, createSessionToken, setSessionCookie } from "@/lib/server/auth";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "register"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
  }

  const user = await createUser(name, email, password);
  const token = await createSessionToken(user);
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
