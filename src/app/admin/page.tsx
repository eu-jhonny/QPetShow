import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { readCollection } from "@/lib/server/store";
import { listOrders, orderStats, orderStatusLabels } from "@/lib/server/orders";
import { getCatalog } from "@/lib/server/catalog";
import { formatBRL, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Painel administrativo", robots: { index: false } };
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pendente: "bg-sun-100 text-sun-800 dark:bg-sun-900/40 dark:text-sun-300",
  pago: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  enviado: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  entregue: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  cancelado: "bg-fire-100 text-fire-700 dark:bg-fire-900/40 dark:text-fire-300",
};

export default async function AdminDashboard() {
  const [orders, stats, leads, catalog] = await Promise.all([
    listOrders(),
    orderStats(),
    readCollection<{ id: string }>("leads"),
    getCatalog(),
  ]);

  const lowStock = catalog.filter((p) => p.stock < 30);
  const recent = orders.slice(0, 6);

  const cards = [
    { icon: DollarSign, label: "Receita", value: formatBRL(stats.revenue), hint: `${stats.paidCount} pagos` },
    { icon: ShoppingBag, label: "Pedidos", value: String(stats.total), hint: `${stats.pending} pendentes` },
    { icon: TrendingUp, label: "Ticket médio", value: formatBRL(stats.ticket), hint: "por pedido pago" },
    { icon: Users, label: "Leads", value: String(leads.length), hint: "capturados" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Dashboard</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Visão geral da loja em tempo real.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, hint }) => (
          <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="font-display mt-3 text-2xl font-extrabold">{value}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label} · {hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-2 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Pedidos recentes</h2>
            <Link href="/admin/pedidos" className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-300">
              Ver todos <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Clock className="size-8 text-gray-300" aria-hidden />
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum pedido ainda. Assim que um pedido chegar, ele aparece aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                    <th className="pb-3 pr-4">Pedido</th>
                    <th className="pb-3 pr-4">Cliente</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 pr-4 font-extrabold">
                        <Link href="/admin/pedidos" className="hover:text-brand-600">#{o.code}</Link>
                      </td>
                      <td className="py-3 pr-4">{o.customer.name}</td>
                      <td className="py-3 pr-4 font-bold">{formatBRL(o.total)}</td>
                      <td className="py-3">
                        <span className={cn("rounded-full px-3 py-1 text-[11px] font-extrabold", statusColors[o.status])}>
                          {orderStatusLabels[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Estoque baixo</h2>
            <Link href="/admin/produtos" className="text-sm font-bold text-brand-600 dark:text-brand-300">Gerenciar</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="py-6 text-sm text-gray-500 dark:text-gray-400">Todos os produtos com bom estoque. 👍</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-2xl bg-fire-50 px-4 py-2.5 dark:bg-fire-900/20">
                  <span className="line-clamp-1 text-sm font-bold">{p.name}</span>
                  <span className="shrink-0 text-xs font-extrabold text-fire-600 dark:text-fire-400">{p.stock} un.</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
