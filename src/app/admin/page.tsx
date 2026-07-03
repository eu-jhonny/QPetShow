import type { Metadata } from "next";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import { readCollection } from "@/lib/server/store";
import { products } from "@/lib/data/products";
import { formatBRL, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false },
};

interface Lead {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

// Vendas de demonstração — em produção, agregar do banco de pedidos
const salesByDay = [
  { day: "Seg", value: 1840 },
  { day: "Ter", value: 2310 },
  { day: "Qua", value: 1970 },
  { day: "Qui", value: 2890 },
  { day: "Sex", value: 3420 },
  { day: "Sáb", value: 4150 },
  { day: "Dom", value: 2640 },
];

const recentOrders = [
  { id: "QPS-490127", customer: "Mariana Silva", total: 244.8, status: "Pago", statusColor: "text-brand-600 bg-brand-100 dark:bg-brand-950 dark:text-brand-300" },
  { id: "QPS-490126", customer: "Carlos Eduardo", total: 69.8, status: "Enviado", statusColor: "text-sky-600 bg-sky-100 dark:bg-sky-900/40 dark:text-sky-300" },
  { id: "QPS-490125", customer: "Fernanda Costa", total: 189.9, status: "Pago", statusColor: "text-brand-600 bg-brand-100 dark:bg-brand-950 dark:text-brand-300" },
  { id: "QPS-490124", customer: "Ricardo Almeida", total: 412.5, status: "Pendente", statusColor: "text-sun-700 bg-sun-100 dark:bg-sun-900/40 dark:text-sun-300" },
];

export default async function AdminPage() {
  const leads = await readCollection<Lead>("leads");
  const totalWeek = salesByDay.reduce((acc, d) => acc + d.value, 0);
  const maxDay = Math.max(...salesByDay.map((d) => d.value));
  const lowStock = products.filter((p) => p.stock < 30);

  const stats = [
    { icon: DollarSign, label: "Vendas na semana", value: formatBRL(totalWeek), delta: "+12,4%" },
    { icon: Package, label: "Pedidos", value: "148", delta: "+8,1%" },
    { icon: Users, label: "Leads capturados", value: String(leads.length), delta: "novos" },
    { icon: TrendingUp, label: "Conversão", value: "3,8%", delta: "+0,5 pp" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Painel administrativo</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Visão geral da loja · atualizado agora</p>
      </header>

      {/* Cards de métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, delta }) => (
          <div key={label} className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                {delta}
              </span>
            </div>
            <p className="font-display mt-3 text-2xl font-extrabold">{value}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Gráfico de vendas */}
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-2 dark:border-white/10 dark:bg-white/5" aria-label="Vendas por dia">
          <h2 className="font-display text-lg font-extrabold">Vendas da semana</h2>
          <div className="mt-6 flex h-48 items-end justify-between gap-3">
            {salesByDay.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-extrabold text-gray-400">{formatBRL(d.value).replace(",00", "")}</span>
                <div
                  className={cn(
                    "w-full rounded-t-xl bg-gradient-to-t transition-all hover:opacity-80",
                    d.value === maxDay ? "from-brand-600 to-brand-400" : "from-brand-300 to-brand-200 dark:from-brand-800 dark:to-brand-700"
                  )}
                  style={{ height: `${(d.value / maxDay) * 100}%` }}
                  role="img"
                  aria-label={`${d.day}: ${formatBRL(d.value)}`}
                />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leads */}
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5" aria-label="Leads recentes">
          <h2 className="font-display text-lg font-extrabold">Leads recentes 🎯</h2>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Nenhum lead ainda. Eles aparecem aqui quando alguém se cadastra na newsletter ou no pop-up.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {leads.slice(-6).reverse().map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-2 rounded-2xl bg-gray-50 px-4 py-2.5 dark:bg-white/5">
                  <span className="truncate text-sm font-bold">{lead.email}</span>
                  <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                    {lead.source}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Pedidos recentes */}
        <section className="overflow-x-auto rounded-3xl border border-black/5 bg-white p-6 shadow-soft lg:col-span-2 dark:border-white/10 dark:bg-white/5" aria-label="Pedidos recentes">
          <h2 className="font-display text-lg font-extrabold">Pedidos recentes</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                <th className="pb-3 pr-4">Pedido</th>
                <th className="pb-3 pr-4">Cliente</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-extrabold">#{order.id}</td>
                  <td className="py-3 pr-4">{order.customer}</td>
                  <td className="py-3 pr-4 font-bold">{formatBRL(order.total)}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-3 py-1 text-[11px] font-extrabold", order.statusColor)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Estoque baixo */}
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5" aria-label="Estoque baixo">
          <h2 className="font-display text-lg font-extrabold">Estoque baixo ⚠️</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 rounded-2xl bg-fire-50 px-4 py-2.5 dark:bg-fire-900/20">
                <span className="line-clamp-1 text-sm font-bold">{p.name}</span>
                <span className="shrink-0 text-xs font-extrabold text-fire-600 dark:text-fire-400">{p.stock} un.</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
