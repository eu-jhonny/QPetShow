import { NextResponse } from "next/server";
import { listOrders } from "@/lib/server/orders";
import { getAdminSession } from "@/lib/server/auth";

/** Lista todos os pedidos — apenas admin. */
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}
