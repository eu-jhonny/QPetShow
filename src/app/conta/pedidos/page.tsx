"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatBRL, cn } from "@/lib/utils";

type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado";

interface Order {
  id: string;
  code: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  trackingCode?: string;
  paymentMethod: string;
  createdAt: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: typeof Package }> = {
  pendente: { label: "Aguardando pagamento", className: "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300", icon: Clock },
  pago: { label: "Pago", className: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300", icon: CheckCircle2 },
  enviado: { label: "Em transporte", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300", icon: Truck },
  entregue: { label: "Entregue", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", className: "bg-fire-100 text-fire-700 dark:bg-fire-900/40 dark:text-fire-300", icon: XCircle },
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conta/pedidos")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Meus pedidos</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Acompanhe suas compras e entregas.</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => <div key={i} className="skeleton h-36 rounded-3xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <Package className="size-12 text-gray-300" aria-hidden />
          <p className="font-display text-xl font-extrabold">Nenhum pedido ainda</p>
          <Link href="/produtos" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
            Fazer primeira compra
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <article key={order.id} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-extrabold">Pedido #{order.code}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold", status.className)}>
                    <StatusIcon className="size-3.5" aria-hidden /> {status.label}
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.quantity}× {item.name}</li>
                  ))}
                </ul>
                {order.trackingCode && (
                  <p className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                    Rastreio: {order.trackingCode}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total · {order.paymentMethod.toUpperCase()}</span>
                  <span className="font-display text-lg font-extrabold text-brand-600 dark:text-brand-300">{formatBRL(order.total)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
