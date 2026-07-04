import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/server/auth";
import { readCollection } from "@/lib/server/store";
import { listOrders } from "@/lib/server/orders";
import type { StoredUser } from "@/lib/server/auth";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const users = await readCollection<StoredUser>("users");
  const orders = await listOrders();

  // Nunca expor passwordHash. Agrega total gasto e nº de pedidos por cliente.
  const customers = users.map((u) => {
    const userOrders = orders.filter(
      (o) => o.userId === u.id || o.customer.email.toLowerCase() === u.email.toLowerCase()
    );
    const spent = userOrders
      .filter((o) => o.status !== "cancelado" && o.status !== "pendente")
      .reduce((acc, o) => acc + o.total, 0);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      orderCount: userOrders.length,
      totalSpent: spent,
    };
  });

  return NextResponse.json({ customers: customers.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) });
}
