import type { Order } from "./orders";

export type PaymentMethod = "pix" | "cartao" | "boleto";

export interface PaymentResult {
  provider: "mercadopago" | "simulado";
  method: PaymentMethod;
  /** Status inicial do pagamento. Cartão aprova na hora; pix/boleto ficam pendentes. */
  approved: boolean;
  pixQrCode?: string; // payload copia-e-cola
  pixQrImage?: string; // data URL / imagem
  boletoUrl?: string;
  boletoBarcode?: string;
  raw?: unknown;
}

export function isMercadoPagoEnabled() {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN;
}

/**
 * Cria uma cobrança. Se houver MERCADOPAGO_ACCESS_TOKEN, integra com a API real
 * do Mercado Pago (PIX). Caso contrário, roda em modo simulado — útil em dev e
 * para demonstração — mantendo todo o fluxo de pedido/e-mail funcionando.
 */
export async function createPayment(order: Order): Promise<PaymentResult> {
  const method = order.paymentMethod;

  if (isMercadoPagoEnabled() && method === "pix") {
    try {
      return await createMercadoPagoPix(order);
    } catch (err) {
      console.error("[payment] Mercado Pago falhou, usando simulação:", err);
    }
  }

  // ----- Modo simulado -----
  if (method === "cartao") {
    return { provider: "simulado", method, approved: true };
  }
  if (method === "boleto") {
    return {
      provider: "simulado",
      method,
      approved: false,
      boletoUrl: "#",
      boletoBarcode: "34191.79001 01043.510047 91020.150008 8 96550000" + Math.floor(order.total * 100),
    };
  }
  // pix simulado
  return {
    provider: "simulado",
    method,
    approved: false,
    pixQrCode: `00020126580014BR.GOV.BCB.PIX0136${order.code}520400005303986540${order.total.toFixed(2)}5802BR5909QPET SHOP6009SAO PAULO62070503***6304`,
  };
}

async function createMercadoPagoPix(order: Order): Promise<PaymentResult> {
  const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      "X-Idempotency-Key": order.id,
    },
    body: JSON.stringify({
      transaction_amount: Number(order.total.toFixed(2)),
      description: `Pedido ${order.code} — QPet Shop`,
      payment_method_id: "pix",
      payer: {
        email: order.customer.email,
        first_name: order.customer.name.split(" ")[0],
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Erro Mercado Pago");
  const tx = data?.point_of_interaction?.transaction_data;
  return {
    provider: "mercadopago",
    method: "pix",
    approved: data?.status === "approved",
    pixQrCode: tx?.qr_code,
    pixQrImage: tx?.qr_code_base64 ? `data:image/png;base64,${tx.qr_code_base64}` : undefined,
    raw: data,
  };
}
