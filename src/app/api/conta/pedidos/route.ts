import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { listOrdersByUser, listOrdersByEmail } from "@/lib/server/orders";

/** Pedidos do cliente logado. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const byUser = await listOrdersByUser(session.sub);
  const byEmail = await listOrdersByEmail(session.email);
  const map = new Map(byUser.concat(byEmail).map((o) => [o.id, o]));
  const orders = Array.from(map.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return NextResponse.json({ orders });
}
