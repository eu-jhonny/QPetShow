import type { Metadata } from "next";
import Link from "next/link";
import { cn, formatBRL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meus pedidos",
  robots: { index: false },
};

// Pedidos de demonstração — em produção, buscar do banco pelo id do usuário logado
const demoOrders = [
  {
    id: "QPS-482913",
    date: "28/06/2026",
    status: "entregue" as const,
    total: 244.8,
    items: ["Bravecto Cães 10-20kg", "Bifinho Premium Carne 500g"],
  },
  {
    id: "QPS-490127",
    date: "01/07/2026",
    status: "transporte" as const,
    total: 69.8,
    items: ["Zee.Pad Tapete Higiênico 30un", "Pipicat Multicat 2kg"],
  },
];

const statusConfig = {
  entregue: { label: "Entregue", className: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300", emoji: "✅" },
  transporte: { label: "Em transporte", className: "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300", emoji: "🚚" },
  processando: { label: "Processando", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300", emoji: "⏳" },
};

export default function PedidosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Meus pedidos</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Acompanhe suas compras e entregas.</p>
      </div>

      {demoOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <span className="text-6xl" aria-hidden>📦</span>
          <p className="font-display text-xl font-extrabold">Nenhum pedido ainda</p>
          <Link href="/produtos" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600">
            Fazer primeira compra
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {demoOrders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <article key={order.id} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-extrabold">Pedido #{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Realizado em {order.date}</p>
                  </div>
                  <span className={cn("rounded-full px-4 py-1.5 text-xs font-extrabold", status.className)}>
                    {status.emoji} {status.label}
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                  {order.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
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
