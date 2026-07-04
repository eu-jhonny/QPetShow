import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrder, updateOrderStatus, type OrderStatus } from "@/lib/server/orders";
import { getAdminSession } from "@/lib/server/auth";
import { sendPaymentApproved, sendOrderShipped } from "@/lib/email";

const patchSchema = z.object({
  status: z.enum(["pendente", "pago", "enviado", "entregue", "cancelado"]),
  trackingCode: z.string().trim().max(60).optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  return NextResponse.json({ order });
}

/** Atualiza o status do pedido e dispara e-mails de acordo — apenas admin. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const status = parsed.data.status as OrderStatus;
  const trackingCode = parsed.data.trackingCode ?? (status === "enviado" ? `BR${Math.floor(1e8 + Math.random() * 9e8)}BR` : undefined);

  const order = await updateOrderStatus(id, status, trackingCode);
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  const lite = {
    code: order.code,
    customerName: order.customer.name,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    total: order.total,
  };
  try {
    if (status === "pago") await sendPaymentApproved(order.customer.email, lite);
    if (status === "enviado" && order.trackingCode) await sendOrderShipped(order.customer.email, lite, order.trackingCode);
  } catch (error) {
    console.error("Erro ao enviar e-mail de status:", error);
  }

  return NextResponse.json({ order });
}
