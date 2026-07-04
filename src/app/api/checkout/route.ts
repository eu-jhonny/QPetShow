import { NextResponse } from "next/server";
import { z } from "zod";
import { checkoutAddressSchema } from "@/lib/validators";
import { getCatalog } from "@/lib/server/catalog";
import { rateLimit, clientKey } from "@/lib/server/rate-limit";
import { getSession } from "@/lib/server/auth";
import { findCoupon, couponDiscount } from "@/lib/server/coupons";
import { createOrder, updateOrderStatus, type OrderItem } from "@/lib/server/orders";
import { createPayment } from "@/lib/server/payment";
import { sendOrderConfirmation, sendPaymentApproved, notifyAdminNewOrder } from "@/lib/email";
import { storeInfo } from "@/lib/data/site";

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(99) }))
    .min(1, "Carrinho vazio"),
  address: checkoutAddressSchema,
  paymentMethod: z.enum(["pix", "cartao", "boleto"]),
  coupon: z.string().trim().max(30).optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "checkout"), 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const session = await getSession();
  const { items, address, paymentMethod, coupon } = parsed.data;

  // Recalcula preços a partir do catálogo — nunca confie nos valores do cliente.
  const catalog = await getCatalog();
  const orderItems: OrderItem[] = [];
  for (const line of items) {
    const product = catalog.find((p) => p.id === line.productId);
    if (!product) {
      return NextResponse.json({ error: "Produto indisponível no carrinho" }, { status: 400 });
    }
    orderItems.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      quantity: line.quantity,
      price: product.price,
    });
  }

  const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  let discount = 0;
  if (coupon) {
    const found = await findCoupon(coupon);
    if (found) discount += couponDiscount(found, subtotal);
  }
  if (paymentMethod === "pix") discount += subtotal * 0.05; // 5% no PIX

  const shipping = subtotal - discount >= storeInfo.freeShippingMin ? 0 : 19.9;
  const total = Math.max(0, subtotal - discount + shipping);

  const order = await createOrder({
    userId: session?.sub ?? null,
    customer: { name: address.fullName, email: session?.email ?? "", phone: address.phone },
    address: {
      cep: address.cep,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    },
    items: orderItems,
    subtotal,
    shipping,
    discount,
    total,
    paymentMethod,
  });

  const payment = await createPayment(order);

  // cartão aprova na hora (simulado); pix/boleto ficam pendentes
  let finalOrder = order;
  if (payment.approved) {
    finalOrder = (await updateOrderStatus(order.id, "pago")) ?? order;
  }

  const lite = {
    code: finalOrder.code,
    customerName: finalOrder.customer.name,
    items: finalOrder.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    total: finalOrder.total,
    paymentMethod: finalOrder.paymentMethod,
    address: `${address.street}, ${address.number} — ${address.city}/${address.state}`,
  };

  // e-mails: confirmação ao cliente + aviso ao admin (+ aprovado se cartão)
  try {
    await Promise.all([
      finalOrder.customer.email ? sendOrderConfirmation(finalOrder.customer.email, lite) : Promise.resolve(),
      notifyAdminNewOrder(lite),
      payment.approved && finalOrder.customer.email ? sendPaymentApproved(finalOrder.customer.email, lite) : Promise.resolve(),
    ]);
  } catch (error) {
    console.error("Erro ao enviar e-mails do pedido:", error);
  }

  return NextResponse.json({
    order: {
      code: finalOrder.code,
      status: finalOrder.status,
      total: finalOrder.total,
    },
    payment: {
      provider: payment.provider,
      approved: payment.approved,
      pixQrCode: payment.pixQrCode,
      pixQrImage: payment.pixQrImage,
      boletoUrl: payment.boletoUrl,
      boletoBarcode: payment.boletoBarcode,
    },
  });
}
