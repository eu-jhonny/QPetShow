"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold">Clientes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{customers.length} clientes cadastrados</p>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-black/5 p-16 text-center text-gray-400 dark:border-white/10">Carregando…</div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-white/15">
          <Users className="size-10 text-gray-300" aria-hidden />
          <p className="font-bold">Nenhum cliente ainda</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Os cadastros da loja aparecem aqui.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 dark:border-white/10">
              <tr className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                <th className="px-5 py-3">Cliente</th>
                <th className="hidden px-5 py-3 md:table-cell">Desde</th>
                <th className="px-5 py-3">Pedidos</th>
                <th className="px-5 py-3">Total gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {customers.map((c) => (
                <tr key={c.id} className="transition hover:bg-brand-50/40 dark:hover:bg-white/5">
                  <td className="px-5 py-3">
                    <span className="block font-bold">{c.name}</span>
                    <span className="block text-xs text-gray-400">{c.email}</span>
                  </td>
                  <td className="hidden px-5 py-3 text-gray-500 md:table-cell dark:text-gray-400">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-5 py-3 font-bold">{c.orderCount}</td>
                  <td className="px-5 py-3 font-bold text-brand-600 dark:text-brand-300">{formatBRL(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
